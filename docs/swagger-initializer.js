window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">

  // the following lines will be replaced by docker/configurator, when it runs in a docker-container
  // Try it out builds a curl command. It does not call the API or accept a key.
  const style = document.createElement("style");
  style.textContent = [
    ".swagger-ui .execute-wrapper{display:block;text-align:left}",
    ".swagger-ui .execute-wrapper .curl-command{margin:0}",
    ".swagger-ui .execute-wrapper .curl-command h4{margin:0 0 8px;text-align:left}",
    ".swagger-ui .execute-wrapper pre.curl{overflow-x:auto;text-align:left;white-space:pre}"
  ].join("");
  document.head.appendChild(style);

  window.ui = SwaggerUIBundle({
    url: "spinitron.json",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl,
      curlOnly
    ],
    layout: "StandaloneLayout"
  });

  //</editor-fold>
};

function curlOnly() {
  return {
    wrapComponents: {
      authorizeBtn: () => () => null,
      authorizeOperationBtn: () => () => null,
      execute: (Original, { React }) => (props) => {
        const curl = buildCurl(props);
        const copy = () => navigator.clipboard.writeText(curl);
        return React.createElement("div", { className: "curl-command" },
          React.createElement("h4", null, "Curl"),
          React.createElement("div", { className: "copy-to-clipboard" },
            React.createElement("button", { type: "button", title: "Copy", "aria-label": "Copy", onClick: copy })
          ),
          React.createElement("pre", { className: "curl microlight" }, curl)
        );
      }
    }
  };
}

function buildCurl(props) {
  const { specSelectors, oas3Selectors, path, method } = props;
  const spec = specSelectors.specJsonWithResolvedSubtrees();
  const values = specSelectors.parameterValues([path, method]).toJS();
  let server = "https://spinitron.com/api";
  const selected = oas3Selectors.serverEffectiveValue(oas3Selectors.selectedServer());
  if (typeof selected === "string" && selected) {
    server = selected.replace(/\/$/, "");
  }

  let urlPath = path;
  const query = [];
  const params = spec.getIn(["paths", path, method, "parameters"]);
  if (params) {
    params.forEach((param) => {
      if (param.get("$ref")) {
        param = spec.getIn(param.get("$ref").replace(/^#\//, "").split("/"));
      }
      if (!param || !param.get) {
        return;
      }
      const name = param.get("name");
      const where = param.get("in");
      let value = values[where + "." + name];
      if (value === undefined) {
        value = values[name];
      }
      if (value && value.toJS) {
        value = value.toJS();
      }
      if (Array.isArray(value)) {
        value = value.filter((item) => item !== "" && item != null);
        if (!value.length) {
          return;
        }
      } else if (value === undefined || value === null || value === "") {
        return;
      }
      if (where === "path") {
        urlPath = urlPath.replace("{" + name + "}", encodeURIComponent(value));
      } else if (where === "query") {
        const items = Array.isArray(value) ? value : [value];
        items.forEach((item) => {
          query.push(encodeURIComponent(name) + "=" + encodeURIComponent(item));
        });
      }
    });
  }

  let url = server + urlPath;
  if (query.length) {
    url += "?" + query.join("&");
  }

  const accept = oas3Selectors.responseContentType(path, method) || "application/json";
  const lines = [
    "curl -X " + sh(method.toUpperCase()) + " \\",
    "  " + sh(url) + " \\",
    "  -H " + sh("Authorization: Bearer YOURAPIKEY") + " \\",
    "  -H " + sh("accept: " + accept)
  ];

  const contentType = oas3Selectors.requestContentType(path, method);
  let body = oas3Selectors.requestBodyValue(path, method);
  if (body && body.toJS) {
    body = body.toJS();
  }
  if (body && typeof body === "object") {
    const parts = [];
    Object.keys(body).forEach((key) => {
      const value = body[key];
      if (value === undefined || value === null || value === "") {
        return;
      }
      parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
    body = parts.join("&");
  }
  if (body) {
    lines[lines.length - 1] += " \\";
    if (contentType) {
      lines.push("  -H " + sh("Content-Type: " + contentType) + " \\");
    }
    lines.push("  --data " + sh(body));
  }

  return lines.join("\n");
}

function sh(value) {
  return "'" + String(value).replace(/'/g, "'\\''") + "'";
}

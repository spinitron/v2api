<?php

class PersonaCest
{
    public function _before(ApiTester $I)
    {
        $I->amBearerAuthenticated(API_KEY);
        $I->haveHttpHeader('Content-Type', 'application/json');
    }

    public function _after(ApiTester $I)
    {
    }

    public function getTest(ApiTester $I)
    {
        $I->sendGET('/personas');
        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseJsonMatchesJsonPath('$..id');
    }

    public function getFilterByNameTest(ApiTester $I)
    {
        $I->sendGET('/personas', ['name' => 'test']);
        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([]);
    }

    public function getByIdTest(ApiTester $I)
    {
        $I->sendGET('/personas/1');
        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseJsonMatchesJsonPath('$.id');
    }

    public function getByIdNotFoundTest(ApiTester $I)
    {
        $I->sendGET('/personas/1123213213123123');
        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::NOT_FOUND);
    }

    public function getByIdBadRequestTest(ApiTester $I)
    {
        $I->sendGET('/personas/asd');
        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::BAD_REQUEST);
    }
}

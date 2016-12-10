<?php

class SpinCest
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
        $I->sendGET('/spins');
        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseJsonMatchesJsonPath('$..id');
    }
}

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
}
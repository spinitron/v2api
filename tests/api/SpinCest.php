<?php

use Codeception\Util\HttpCode;

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

    public function postInvalidTest(ApiTester $I)
    {
        $I->haveHttpHeader('Content-Type', 'application/x-www-form-urlencoded');
        $I->sendPOST('/spins');
        $I->seeResponseCodeIs(HttpCode::UNPROCESSABLE_ENTITY);
        $I->seeResponseContainsJson([
            'field' => 'artist_name',
        ]);
        $I->seeResponseContainsJson([
            'field' => 'song_name',
        ]);
    }

    public function postTest(ApiTester $I)
    {
        $datetime = date('Y-m-d H:i:s');
        $attributes = [
            'artist_name' => 'a name',
            'song_name' => 's name',
            'song_composer' => 'c name',
            'spin_duration' => '2:34', // will be converted to 154 seconds
            'spin_timestamp' => $datetime,
        ];
        $I->haveHttpHeader('Content-Type', 'application/x-www-form-urlencoded');
        $I->sendPOST('/spins', $attributes);
        $I->seeResponseCodeIs(HttpCode::CREATED);

        // Api converts duration to seconds.
        $attributes['spin_duration'] = 154;
        $I->seeResponseContainsJson($attributes);
        $I->seeResponseJsonMatchesJsonPath('$.playlist_id');
    }

    public function getTest(ApiTester $I)
    {
        $I->sendGET('/spins');
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseJsonMatchesJsonPath('$..id');
    }

    public function getFilterByDatetimeTest(ApiTester $I) {

    }

    public function getFilterByShowTest(ApiTester $I) {

    }

    public function getFilterByPlaylistTest(ApiTester $I) {

    }

    public function getLimitTest(ApiTester $I) {
        $I->sendGET('/spins', ['limit' => 5]);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseJsonMatchesJsonPath('$.[4]');
        $I->dontSeeResponseJsonMatchesJsonPath('$.[5]');

        $I->sendGET('/spins', ['limit' => 10]);
        $I->seeResponseCodeIs(HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseJsonMatchesJsonPath('$.[9]');
        $I->dontSeeResponseJsonMatchesJsonPath('$.[10]');

    }
}

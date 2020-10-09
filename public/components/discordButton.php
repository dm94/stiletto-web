<?php

class DiscordButton {
    var $base_url = 'https://discord.com/api/';
    private $client_id;
    private $client_secret;
    private $redirect_url;
    var $scope_array = array('identify','guilds');

    public function __construct($client_id,$client_secret,$redirect_url) {
        $this->client_id = $client_id;
        $this->client_secret = $client_secret;
        $this->redirect_url = $redirect_url;
    }

    public function authenticate() {
        $i		= 0;
        $return = '';
        $len	= count($this->scope_array);
        foreach ($this->scope_array as $scope) {
            if ($i == $len - 1) {
                $scope .= "";
                $return .= $scope;
            } else {
                $scope .= "%20";
                $return .= $scope;
            }
            $i++;
        }
        $scope = $return;
        $authenticate_url = $this->base_url . 'oauth2/authorize?client_id=' . $this->client_id . '&redirect_uri=' . $this->redirect_url . '&scope=' . $scope.'&response_type=code';
        return $authenticate_url;
    }

    public function get_user($discordcode){
        $resp = $this->get_access_token($discordcode);
        if (isset($resp->access_token)) {
            $access_token = $resp->access_token;
            $info_request =  $this->base_url.'users/@me';
            $info = curl_init();
            curl_setopt_array($info, array(
                CURLOPT_URL => $info_request,
                CURLOPT_HTTPHEADER => array(
                    "Authorization: Bearer {$access_token}"
                ),
                CURLOPT_RETURNTRANSFER => true
            ));
            $user = json_decode(curl_exec($info));
            curl_close($info);
            return $user;
        } else {
            return json_encode(array("message" => "Authentication Error"));
        }
    }

    public function get_guilds($discordcode){
        $resp = $this->get_access_token($discordcode);
        if (isset($resp->access_token)) {
            $access_token = $resp->access_token;
            $info_request = $this->base_url.'users/@me/guilds';
            $info = curl_init();
            curl_setopt_array($info, array(
                CURLOPT_URL => $info_request,
                CURLOPT_HTTPHEADER => array(
                    "Authorization: Bearer {$access_token}"
                ),
                CURLOPT_RETURNTRANSFER => true
            ));
            $guilds = json_decode(curl_exec($info));
            curl_close($info);
            return $guilds;
        } else {
            return json_encode(array("message" => "Authentication Error"));
        }
    }

    public function get_access_token($code) {
		$token_request = $this->base_url.'oauth2/token';
        $token = curl_init();
        curl_setopt_array($token, array(
            CURLOPT_URL => $token_request,
            CURLOPT_POST => 1,
            CURLOPT_POSTFIELDS => array(
                "grant_type" => "authorization_code",
                "client_id" => $this->client_id,
                "client_secret" => $this->client_secret,
                "redirect_uri" => $this->redirect_url,
                "code" => $code
            )
        ));
        curl_setopt($token, CURLOPT_RETURNTRANSFER, true);
        $resp = json_decode(curl_exec($token));
        curl_close($token);
        return $resp;
	}
}
?>

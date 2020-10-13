<?php
    require './config.php';
    require './discordApi.php';
    $discordapi = new DiscordApi($config['DISCORD_CLIENT_ID'],$config['DISCORD_CLIENT_SECRET'],'https://stiletto.comunidadgzone.es/api/v1/discordlogin.php');
    $discordcode = isset($_GET['code']) ? $_GET['code'] : null;
    if (!empty($discordcode)) {
        $user = $discordapi->get_user($discordcode);
        $discord_username = $user->username.'#'.$user->discriminator;
        $user_discord_id = $user->id;

        if ($user_discord_id != null) {
            $randomtoken = substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 16);
            $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
            $query = "INSERT INTO users(discordID, discordTag,token) VALUES (?,?,?) ON DUPLICATE KEY UPDATE discordTag=?, token=?";
            $statement = $mysqli->prepare($query);
            $statement->bind_param('sssss', $user_discord_id, $discord_username, $randomtoken, $discord_username, $randomtoken);
            $statement->execute();
            mysqli_close($mysqli);

            header('Location: http://localhost:3000/clan?discordid='.$user_discord_id.'&token='.$randomtoken);
        } else {
            //header('Location: http://localhost:3000/clan?error');
        }
    }
    //header('Location: http://localhost:3000/clan?error');

?>
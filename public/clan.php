<?php
    session_start();
    $user_discord_id = null;
    $connected = false;
    if(isset($_SESSION["user_discord_id"])){
        $user_discord_id = $_SESSION["user_discord_id"];
        $connected = true;
    } else {
        $_SESSION = array();
    }

    include ('./config.php');
    $discord_username = "User#0000";
    $nickname = "Not defined";
    $user_clan = "No Clan";
?>
<head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=UA-104878658-2"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      gtag("config", "UA-104878658-2");
    </script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
    <script src="https://kit.fontawesome.com/bba734017e.js" crossorigin="anonymous"></script>
    <title>Manage Clan - Stiletto</title>
</head>
<body class="d-flex flex-column h-100">
    <?php include_once ('./components/header.php'); ?>
    <main role="main" class="flex-shrink-0">
        <div class="container">
        <?php
            $discordcode = isset($_GET['code']) ? $_GET['code'] : null;
            if ($connected == false && !empty($discordcode)) {
                $token_request = "https://discord.com/api/oauth2/token";
                $token = curl_init();
                curl_setopt_array($token, array(
                    CURLOPT_URL => $token_request,
                    CURLOPT_POST => 1,
                    CURLOPT_POSTFIELDS => array(
                        "grant_type" => "authorization_code",
                        "client_id" => $config['DISCORD_CLIENT_ID'],
                        "client_secret" => $config['DISCORD_CLIENT_SECRET'],
                        "redirect_uri" => $config['DISCORD_REDIRECT_URL'],
                        "code" => $discordcode
                    )
                ));
                curl_setopt($token, CURLOPT_RETURNTRANSFER, true);
                $resp = json_decode(curl_exec($token));
                curl_close($token);
                if (isset($resp->access_token)) {
                    $access_token = $resp->access_token;
                    $info_request = "https://discord.com/api/users/@me";
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
                    $discord_username = $user->username.'#'.$user->discriminator;
                    $user_discord_id = $user->id;
                    $connected = true;
                    $_SESSION["user_discord_id"] = $user_discord_id;

                    $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
                    $query = "INSERT INTO users(discordID, discordTag) VALUES (?,?) ON DUPLICATE KEY UPDATE discordTag=?";
                    $statement = $mysqli->prepare($query); // Prepare query for execution
                    $statement->bind_param('sss', $user_discord_id, $discord_username, $discord_username);
                    $statement->execute();
                    mysqli_close($mysqli);
                } else {
                    echo json_encode(array("message" => "Authentication Error"));
                }
            }
        ?>
        <?php
            if ($connected) {
                $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
                $query = "SELECT nickname, clanid, discordTag  FROM users where discordID='".$user_discord_id."'";
                $result = mysqli_query($mysqli, $query);
                $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

                if ($row["nickname"] != null) {
                    $nickname = $row["nickname"];
                }
                if ($row["discordTag"] != null) {
                    $discord_username = $row["discordTag"];
                }
                if ($row["clanid"] != null) {
                    $user_clan = $row["clanid"];
                }

                mysqli_free_result($result);
                mysqli_close($mysqli);

                /* If you are connected we show this */
        ?>
            <div class="row">
                <div class="col-6">
                    <div class="card border-secondary mb-3">
                        <div class="card-header">Your details</div>
                        <div class="card-body text-secondary">
                            <ul class="list-group mb-3">
                                <li class="list-group-item d-flex justify-content-between lh-condensed">
                                    <div class="my-0">Discord Tag</div>
                                    <div class="text-muted"><?php echo $discord_username;?></div>
                                </li>
                                <li class="list-group-item d-flex justify-content-between lh-condensed">
                                    <div class="my-0">Nick in Game</div>
                                    <div class="text-muted"><?php echo $nickname;?></div>
                                </li>
                                <li class="list-group-item d-flex justify-content-between lh-condensed">
                                    <div class="my-0">Clan</div>
                                    <div class="text-muted"><?php echo $user_clan;?></div>
                                </li>
                            </ul>
                            <a class="btn btn-lg btn-outline-danger btn-block" href="#">Delete user</a>
                        </div> 
                    </div>
                </div>
            </div>
        <?php
            } else {
        ?>
        <div class="col-12">
            <?php include ('./components/discordButton.php'); ?>
        </div>
        <?php
            }
        ?>
        </div>
    </main>

    <?php

    /*$mysqli = new mysqli($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);

    $consulta = "SELECT walkerID, datelastuse FROM walkers";

    if ($resultado = $mysqli->query($consulta)) {

        while ($fila = $resultado->fetch_row()) {
            printf ("%s (%s)\n", $fila[0], $fila[1]);
        }
        $resultado->close();
    }
    $mysqli->close();*/
    ?>
    <?php include_once ('./components/footer.php'); ?>
</body>
<?php
    session_start();
    $accion = isset($_POST['accion']) ? $_POST['accion'] : null;
    include ('./config.php');
    $user_discord_id = null;
    $connected = false;
    if(isset($_SESSION["user_discord_id"])){
        $user_discord_id = $_SESSION["user_discord_id"];
        $connected = true;

        if ($accion =='delete_user' && $user_discord_id != null) {
            $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
            $query = "delete from users where discordID=?";
            $statement = $mysqli->prepare($query);
            $statement->bind_param('s', $user_discord_id);
            $statement->execute();
            mysqli_close($mysqli);

            $connected = false;
            $_SESSION = array();
        }
    } else {
        $_SESSION = array();
    }

    $discord_username = "User#0000";
    $user_clan = "No Clan";
    $nickname = isset($_POST['user_game_name']) ? $_POST['user_game_name'] : "Not defined";
?>
<script src="https://www.google.com/recaptcha/api.js"></script>
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
    <title>User profile - Stiletto</title>
</head>
<script>
   function onSubmit(token) {
       document.getElementById("deleteUserForm").submit();
   }
 </script>
<body class="d-flex flex-column h-100">
    <?php include_once ('./components/header.php'); ?>
    <main role="main" class="flex-shrink-0">
        <div class="container">
        <?php
            require_once ('./components/discordButton.php');
            $discordapi = new DiscordButton($config['DISCORD_CLIENT_ID'],$config['DISCORD_CLIENT_SECRET'],$config['DISCORD_REDIRECT_URL']);
            $discordcode = isset($_GET['code']) ? $_GET['code'] : null;
            if ($connected == false && !empty($discordcode)) {
                $user = $discordapi->get_user($discordcode);
                $discord_username = $user->username.'#'.$user->discriminator;
                $user_discord_id = $user->id;

                if ($user_discord_id != null) {
                    $connected = true;
                    $_SESSION["user_discord_id"] = $user_discord_id;
                    $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
                    $query = "INSERT INTO users(discordID, discordTag) VALUES (?,?) ON DUPLICATE KEY UPDATE discordTag=?";
                    $statement = $mysqli->prepare($query);
                    $statement->bind_param('sss', $user_discord_id, $discord_username, $discord_username);
                    $statement->execute();
                    mysqli_close($mysqli);
                }
            } else if ($connected == false) {
                ?>
                    <div class="col-12">
                        <a class="btn btn-lg btn-outline-primary btn-block" href="<?php echo $discordapi->authenticate(); ?>">
                            <i class="fab fa-discord"></i> Login with discord
                        </a>
                    </div>
                <?
            }
        ?>
        <?php
            if ($connected && $user_discord_id != null) {
                /* If you are connected we show this */
                if ($accion=='change_user_game_name') {
                    /* To change the name of the game */
                    $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
                    $nickname = $mysqli->escape_string($nickname);
                    $query = "update users set nickname=? where discordID=?";
                    $statement = $mysqli->prepare($query);
                    $statement->bind_param('ss', $nickname, $user_discord_id);
                    $statement->execute();
                    mysqli_close($mysqli);
                }


                $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
                $query = "SELECT users.nickname nickname, clans.name clan, users.discordTag discordTag  FROM users LEFT JOIN clans on users.clanid=clans.discordid where users.discordID='".$user_discord_id."'";
                $result = mysqli_query($mysqli, $query);
                $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

                if ($row["nickname"] != null) {
                    $nickname = $row["nickname"];
                }
                if ($row["discordTag"] != null) {
                    $discord_username = $row["discordTag"];
                }
                if ($row["clan"] != null) {
                    $user_clan = $row["clan"];
                }

                mysqli_free_result($result);
                mysqli_close($mysqli);

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
                            <form method="POST" id="deleteUserForm" action="">
                                <input type="hidden" name="accion" value="delete_user"/>
                                <button class="btn btn-lg btn-outline-danger btn-block g-recaptcha" data-sitekey="6LeuONQZAAAAANRgjK7KisOiAHp1apuZucokpOKw" 
                                data-callback='onSubmit' data-action='submit'>Delete user</button>
                            </form>
                        </div> 
                    </div>
                </div>
                <?php
                    if ($nickname == null || $nickname == "Not defined") {
                        /* So that it only appears when we do not have a defined name */
                ?>
                    <div class="col-6">
                        <div class="card border-secondary mb-3">
                            <div class="card-header">Add name in the game</div>
                            <div class="card-body text-succes">
                                <form method="POST" action="">
                                    <div class="form-group">
                                        <label for="user_game_name">Your name in Last Oasis</label>
                                        <input type="text" class="form-control" name="user_game_name" value="<?php echo $nickname; ?>"/>
                                        <input type="hidden" name="accion" value="change_user_game_name"/>
                                    </div>
                                    <button class="btn btn-lg btn-outline-success btn-block" type="submit">Add</button>
                                </form>
                            </div> 
                        </div>
                    </div>
                <?php
                    }
                ?>
                <?php
                    if ($user_clan == null || $user_clan == "No Clan") {
                        /* So that it only appears when we do not have a defined name */
                ?>
                    <div class="col-6">
                        <div class="card border-secondary mb-3">
                            <div class="card-header">Add clan</div>
                            <div class="card-body text-succes">
                                <a class="btn btn-lg btn-outline-info btn-block" href="#">Join a clan</a>
                                <a class="btn btn-lg btn-outline-warning btn-block" href="https://stiletto.comunidadgzone.es/addclan">Create a clan</a>
                                <p class="text-muted text-center">Only valid if you are the owner of the some discord</p>
                            </div> 
                        </div>
                    </div>
                <?php
                    }
                ?>
            </div>
        <?php
            }
        ?>
        </div>
    </main>
    <?php include_once ('./components/footer.php'); ?>
</body>
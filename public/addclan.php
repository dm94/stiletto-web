<?php
    session_start();
    $accion = isset($_POST['accion']) ? $_POST['accion'] : null;
    require ('./config.php');
    $user_discord_id = null;
    $connected = false;
    if(isset($_SESSION["user_discord_id"])){
        $user_discord_id = $_SESSION["user_discord_id"];
        $connected = true;

        if ($accion =='add_clan' && $user_discord_id != null) {
            $clan_name = isset($_POST['clan_name']) ? $_POST['clan_name'] : null;
            $discordinvite = isset($_POST['discord_invite']) ? $_POST['discord_invite'] : null;

            if ($clan_name != null) {
                $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
                $clan_name = $mysqli->escape_string($clan_name);
                $discordinvite = $mysqli->escape_string($discordinvite);
                $query = "INSERT INTO clans(name, invitelink, leaderid) VALUES (?,?,?)";
                $statement = $mysqli->prepare($query);
                $statement->bind_param('sss', $clan_name,$discordinvite,$user_discord_id);
                $statement->execute();
                mysqli_close($mysqli);
    
                $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
                $query = "select clanid from clans where leaderid=".$user_discord_id;
                $result = mysqli_query($mysqli, $query);
                $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
                $clandiscordid = $row['clanid'];
                mysqli_free_result($result);
                mysqli_close($mysqli);


                $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
                $query = "update users set clanid=? where discordID=?";
                $statement = $mysqli->prepare($query);
                $statement->bind_param('ss', $clandiscordid,$user_discord_id);
                $statement->execute();
                mysqli_close($mysqli);

                header('Location: '.$config['DISCORD_REDIRECT_URL']);
            }
        }
    } else {
        $_SESSION = array();
    }
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
    <title>Add Clan - Stiletto</title>
</head>
<body class="d-flex flex-column h-100">
    <?php include ('./components/header.php'); ?>
    <main role="main" class="flex-shrink-0">
        <div class="container">
        <?php
            if ($connected == true) {
                $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
                $query = "select * from users where discordid=".$user_discord_id;
                $result = mysqli_query($mysqli, $query);
                $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
                $clanid = $row['clanid'];
                mysqli_free_result($result);
                mysqli_close($mysqli);
                if ($clanid == null) {
            ?>
                <div class="col-6">
                    <div class="card border-secondary mb-3">
                        <div class="card-body text-succes">
                            <form method="POST" action="">
                                <div class="form-group">
                                    <label for="clan_name">Clan Name</label>
                                    <input type="text" class="form-control" id="clan_name" name="clan_name" value="" required/>
                                </div>
                                <div class="form-group">
                                    <label for="discord_invite">Discord Link Invite (Optional)</label>
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">https://discord.gg/</span>
                                        </div>
                                        <input type="text" class="form-control" id="discord_invite" name="discord_invite" value="" maxlength="10"/>
                                    </div>
                                </div>
                                <button class="btn btn-lg btn-outline-success btn-block" type="submit">Create a clan</button>
                            </form>
                        </div> 
                    </div>
                </div> 
            <?php
                } else {
                    header('Location: '.$config['DISCORD_REDIRECT_URL']);
                }
            } else {
                header('Location: '.$config['DISCORD_REDIRECT_URL']);
            }
        ?>
        </div>
    </main>
    <?php include ('./components/footer.php'); ?>
</body>
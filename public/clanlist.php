<?php
    session_start();
    $accion = isset($_POST['accion']) ? $_POST['accion'] : null;
    $message = null;
    require ('./config.php');
    $user_discord_id = null;
    $connected = false;
    $user_clan_id = null;
    if(isset($_SESSION["user_discord_id"])){
        $user_discord_id = $_SESSION["user_discord_id"];
        $connected = true;
        $clanid = isset($_POST['clanid']) ? $_POST['clanid'] : null;
        if ($accion=='send_request' && $clanid != null) {
            $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
            $query = "select * from clanrequest where discordid=".$user_discord_id;
            $result = mysqli_query($mysqli, $query);
            if ( mysqli_num_rows($result) > 0) {
                mysqli_free_result($result);
                $query = "insert into clanrequest(clanid,discordid) values(?,?)";
                $statement = $mysqli->prepare($query);
                $statement->bind_param('ss', $clanid, $user_discord_id);
                $statement->execute();
            } else {
                $message = "You already have a pending application to join a clan";
            }
            mysqli_close($mysqli);
        }
    } else {
        $_SESSION = array();
        header('Location: '.$config['DISCORD_REDIRECT_URL']);
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
    <title>Clan List - Stiletto</title>
</head>
<body class="d-flex flex-column h-100">
    <?php include ('./components/header.php'); ?>
    <main role="main" class="flex-shrink-0">
        <div class="container">
        <?php
            if ($connected == true) {
                $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
                $query = "SELECT clanid  FROM users where discordID='".$user_discord_id."'";
                $result = mysqli_query($mysqli, $query);
                $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

                if ($row["clanid"] != null) {
                    $user_clan_id = $row["clanid"];
                }

                mysqli_free_result($result);

                $query = "SELECT clans.discordid clanid, clans.name, clans.invitelink, clans.recruitment, users.discordTag, clans.leaderid leaderid FROM clans left join users on clans.leaderid=users.discordID";
                $result = mysqli_query($mysqli, $query);

            if ($message != null) {
        ?>
            <div class="col-xl-6">
                <div class="card">
                    <div class="card-header"><?php echo $message;?></div>
                </div>
            </div>
        <?php
            }
        ?>
            <div class="col-xl-6">
                <div class="card">
                    <div class="card-body">
                        <a class="btn btn-outline-secondary btn-block" href="<?php echo $config['DISCORD_REDIRECT_URL']; ?>">Go back</a>
                    </div> 
                </div>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th class="text-center" scope="col">Clan Name</th>
                        <th class="text-center" scope="col">Leader</th>
                        <th class="text-center" scope="col">Discord Invite Link</th>
                        <th class="text-center" scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
        <?php
                while ($row = $result->fetch_assoc()) {
        ?>
                <tr>
                    <td class="text-center"><?php echo $row['name']; ?></th>
                    <td class="text-center"><?php echo $row['discordTag']; ?></td>
                    <td class="text-center">
                    <?php 
                        if ($row['invitelink'] != null) {
                            echo "<a href='https://discord.gg/".$row['invitelink']."'target='_blank' >".$row['invitelink']."</a>"; 
                        }
                    ?>
                    </td>
                    <td>
                    <?php
                        if ($user_clan_id == null) {
                    ?>
                        <form method="POST" id="sendrequestform" action="">
                            <input type="hidden" name="accion" value="send_request"/>
                            <input type="hidden" name="clanid" value="<?php echo $row['clanid'];?>"/>
                            <button class="btn btn-block btn-primary" type="submit">Send request</button>
                        </form>
                    <?php
                        }
                        if ($row['leaderid'] == $user_discord_id){
                    ?>     
                            <a class="btn btn-block btn-primary" href="<?php echo $config['DISCORD_REDIRECT_URL']; ?>">View applications</a>
                    <?php  
                        }
                    ?>
                    </td>
                </tr>
        <?php
                }
        ?>
                </tbody>
            </table>
        <?php
                mysqli_free_result($result);
                mysqli_close($mysqli);
            } else {
                header('Location: '.$config['DISCORD_REDIRECT_URL']);
            }
        ?>
        </div>
    </main>
    <?php include ('./components/footer.php'); ?>
</body>
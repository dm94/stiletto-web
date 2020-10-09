<?php
    session_start();
    $accion = isset($_POST['accion']) ? $_POST['accion'] : null;
    require './config.php';
    $user_discord_id = null;
    $connected = false;
    if(isset($_SESSION['user_discord_id'])){
        $user_discord_id = $_SESSION['user_discord_id'];
        $connected = true;
    } else {
        $_SESSION = array();
        header('Location: '.$config['DISCORD_REDIRECT_URL']);
    }
?>
<html lang="en">
<head>
    <meta charset="utf-8">
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-104878658-2"></script>
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
    <title>Clan Members - Stiletto</title>
</head>
<body class="d-flex flex-column h-100">
    <?php include './components/header.php'; ?>
    <main role="main" class="container">
        <div class="row">
            <div class="col-xl-12">
                <div class="card border-secondary mb-3">
                    <div class="card-body">
                        <?php
                            $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
                            $query = 'SELECT users.nickname, users.discordtag, users.discordid userdiscordid, clans.discordid clandiscordid, clans.leaderid, clans.clanid FROM users,clans WHERE users.clanid = clans.clanid and clans.clanid in (select clanid from users where discordID='.$user_discord_id.')';
                            $result = mysqli_query($mysqli, $query);
                        ?>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th class="text-center" scope="col">Discord Tag</th>
                                    <th class="text-center" scope="col">Nick in game</th>
                                    <th class="text-center" scope="col">Kick</th>
                                </tr>
                            </thead>
                            <tbody>
                            <?php
                                while ($row = $result->fetch_assoc()) {
                                    if ($row['leaderid'] == $user_discord_id && $accion=='kick_from_clan') {
                                        $userkickid = isset($_POST['userkickid']) ? $_POST['userkickid'] : null;
                                        $query = "update users set clanid=null where discordID=? and clanid=?";
                                        $statement = $mysqli->prepare($query);
                                        $statement->bind_param('ss', $userkickid,$row['clanid']);
                                        $statement->execute();
                                        mysqli_close($mysqli);
                                        header('Location: https://stiletto.comunidadgzone.es/members');
                                        break;
                                    }
                            ?>
                                <tr>
                                    <td class="text-center"><?php echo $row['discordtag']; ?></th>
                                    <td class="text-center"><?php echo $row['nickname']; ?></td>
                                    <td>
                                    <?php 
                                        if ($row['leaderid'] == $user_discord_id && $row['userdiscordid'] != $user_discord_id) {
                                    ?> 
                                        <form method="POST" action="">
                                            <input type="hidden" name="accion" value="kick_from_clan"/>
                                            <input type="hidden" name="userkickid" value="<?php echo $row['userdiscordid']; ?>"/>
                                            <button class="btn btn-danger btn-block" type="submit">Kick</button>
                                        </form>
                                    <?php
                                        }
                                    ?>
                                    </td>
                                </tr>
                            <?php
                                }
                                mysqli_free_result($result);
                                mysqli_close($mysqli);
                                ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <?php include './components/footer.php'; ?>
</body>
</html>
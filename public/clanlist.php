<?php
    session_start();
    $accion = isset($_POST['accion']) ? $_POST['accion'] : null;
    include ('./config.php');
    $user_discord_id = null;
    $connected = false;
    if(isset($_SESSION["user_discord_id"])){
        $user_discord_id = $_SESSION["user_discord_id"];
        $connected = true;
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
    <title>Clan List - Stiletto</title>
</head>
<body class="d-flex flex-column h-100">
    <?php include_once ('./components/header.php'); ?>
    <main role="main" class="flex-shrink-0">
        <div class="container">
        <?php
            if ($connected == true) {
                $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
                $query = "SELECT clans.name, clans.invitelink, clans.recruitment, users.discordTag FROM clans left join users on clans.leaderid=users.discordID";
                $result = mysqli_query($mysqli, $query);
        ?>
            <table class="table">
                <thead>
                    <tr>
                        <th class="text-center" scope="col">Clan Name</th>
                        <th class="text-center" scope="col">Leader</th>
                        <th class="text-center" scope="col">Recruiting</th>
                        <th class="text-center" scope="col">Discord Invite Link</th>
                        <th class="text-center" scope="col">Send request</th>
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
                            if ($row['recruitment']) {
                                echo '<i class="fas fa-check"></i>';
                            } else {
                                echo '<i class="fas fa-times"></i>';
                            }
                        ?>
                    </td>
                    <td class="text-center"><?php echo $row['invitelink']; ?></td>
                    <td><button class="btn btn-block btn-primary" type="submit">Send request (not working)</button></td>
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
    <?php include_once ('./components/footer.php'); ?>
</body>
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require './config.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $discordid = isset($_GET['discordid']) ? $_GET['discordid'] : null;
    $token = isset($_GET['token']) ? $_GET['token'] : null;

    $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
    $query = "delete from users where discordID=? and token=?";
    $statement = $mysqli->prepare($query);
    $statement->bind_param('ss', $discordid,$token);
    $statement->execute();
    mysqli_close($mysqli);
    http_response_code(204);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = isset($_POST['accion']) ? $_POST['accion'] : null;
    $dataupdate = isset($_POST['dataupdate']) ? $_POST['dataupdate'] : null;
    $discordid = isset($_POST['discordid']) ? $_POST['discordid'] : null;
    $token = isset($_POST['token']) ? $_POST['token'] : null;

    if ($accion == 'changeusergamename' && $dataupdate != null) {
        /* To change the name of the game */
        $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
        $dataupdate = $mysqli->escape_string($dataupdate);
        $query = "update users set nickname=? where discordID=? and token=?";
        $statement = $mysqli->prepare($query);
        $statement->bind_param('sss', $dataupdate, $discordid,$token);
        $statement->execute();
        mysqli_close($mysqli);
        http_response_code(202);
    } else {
        //http_response_code(401);
        echo json_encode(array('Error' => $_POST));
    }

} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $discordid = isset($_GET['discordid']) ? $_GET['discordid'] : null;
    $token = isset($_GET['token']) ? $_GET['token'] : null;

    if ($discordid != null && $token != null) {
        $mysqli = mysqli_connect($config['DB_HOST'],$config['DB_USERNAME'],$config['DB_PASSWORD'],$config['DB_DATABASE']);
        $query = 'select users.nickname, users.discordtag, users.clanid, clans.name clanname, clans.leaderid from users left join clans on clans.clanid=users.clanid where users.discordid=? and users.token=?';
        $statement = $mysqli->prepare($query);
        $statement->bind_param('ss', $discordid, $token);
        $statement->execute();
        $result = $statement->get_result();
        $row = $result->fetch_array(MYSQLI_ASSOC);

        if ($row == null) {
            http_response_code(205);
            echo json_encode(array('Error' => 'This user cannot be found'));
        } else {
            http_response_code(200);
            echo json_encode($row);
        }

        mysqli_free_result($result);
        mysqli_close($mysqli);
    } else {
        http_response_code(401);
        echo json_encode(array('Error' => 'You have to add the data requested by the api'));
    }
} else {
    http_response_code(401);
    echo json_encode(array('Error' => 'You have to add the data requested by the api'));
}

?>
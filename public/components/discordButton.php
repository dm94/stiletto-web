<?php
    include ('../config.php');
    $url = "https://stiletto.comunidadgzone.es/clan";
?>
<a class="btn btn-lg btn-outline-primary btn-block" href="https://discord.com/api/oauth2/authorize?client_id=<?php echo $config['DISCORD_CLIENT_ID'];?>&redirect_uri=<?php echo $url;?>&response_type=code&scope=identify">
    <i class="fab fa-discord"></i> Login with discord
</a>
<?php

// Run `forta status` command and capture the output
$output = shell_exec('HOME=/var/www/html forta status');

echo $output;
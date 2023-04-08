<?php
$cpuUsage = sys_getloadavg()[0];
$uptime = exec('uptime -p');
$ramUsage = round((memory_get_usage(true) / 1024 / 1024), 2) . ' MB';

$data = [
  'cpuUsage' => $cpuUsage,
  'uptime' => $uptime,
  'ramUsage' => $ramUsage
];

header('Content-Type: application/json');
echo json_encode($data);
?>
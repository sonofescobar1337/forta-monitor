<?php
$cpuUsage = sys_getloadavg()[0];
$uptime = exec('uptime -p');

$diskTotal = round((disk_total_space('/') / 1024 / 1024 / 1024), 2) . ' GB';
$diskFree = round((disk_free_space('/') / 1024 / 1024 / 1024), 2) . ' GB';

$total_ram = round(shell_exec("free -b | grep Mem | awk '{print $2}'") / 1024 / 1024);
$free_ram = round(shell_exec("free -b | grep Mem | awk '{print $4}'") / 1024 / 1024);
$used_ram = $total_ram - $free_ram;

$data = [
    'cpuUsage' => $cpuUsage,
    'uptime' => $uptime,
    'usedRam' => $used_ram . ' MB',
    'diskTotal' => $diskTotal,
    'diskFree' => $diskFree
];
header('Content-Type: application/json');
echo json_encode($data);
?>

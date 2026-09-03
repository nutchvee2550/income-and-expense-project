<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';

$sql = "SELECT * FROM quick_amounts ORDER BY amount ASC";
$result = $conn->query($sql);

$amounts = array();

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $amounts[] = $row;
    }
}

echo json_encode($amounts, JSON_UNESCAPED_UNICODE);
?>
<?php
// ปิด Error เพื่อป้องกัน Response พัง
ini_set('display_errors', 0);
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

// รับข้อมูลจาก Fetch API
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "ไม่พบข้อมูลที่ส่งมา"]);
    exit();
}

// รองรับการส่ง id ทุกรูปแบบ
$id = 0;
if (isset($data['id'])) $id = (int)$data['id'];
elseif (isset($data['transaction_id'])) $id = (int)$data['transaction_id'];

$type = isset($data['type']) ? $conn->real_escape_string($data['type']) : 'expense';
$category = isset($data['category']) ? $conn->real_escape_string($data['category']) : '';
$title = isset($data['title']) ? $conn->real_escape_string($data['title']) : '';
$amount = isset($data['amount']) ? (float)$data['amount'] : 0;

if ($id > 0) {
    // อัปเดตข้อมูลตรงๆ
    $sql = "UPDATE transactions SET 
            type = '$type', 
            category = '$category', 
            title = '$title', 
            amount = $amount 
            WHERE id = $id";

    if ($conn->query($sql)) {
        echo json_encode([
            "status" => "success", 
            "message" => "อัปเดตเรียบร้อยแล้ว"
        ]);
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => "Database Error: " . $conn->error
        ]);
    }
} else {
    echo json_encode([
        "status" => "error", 
        "message" => "ไม่พบ ID ของรายการที่จะแก้ไข"
    ]);
}
?>
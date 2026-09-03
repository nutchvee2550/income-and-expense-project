<?php
// เปิดแสดง Error เพื่อดูปัญหาชัดเจน
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

// ลองลบข้อมูลทั้งหมดและรีเซ็ต ID
$sql = "TRUNCATE TABLE transactions";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว"]);
} else {
    // ถ้า TRUNCATE ไม่ผ่าน (เช่น ติด Foreign Key) ให้ใช้ DELETE + ALTER แทน
    $deleteSql = "DELETE FROM transactions";
    $resetSql = "ALTER TABLE transactions AUTO_INCREMENT = 1";

    if ($conn->query($deleteSql) === TRUE) {
        $conn->query($resetSql);
        echo json_encode(["status" => "success", "message" => "ล้างข้อมูลเรียบร้อยแล้ว"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    }
}

$conn->close();
?>
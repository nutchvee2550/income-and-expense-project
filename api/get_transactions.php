<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8"); // <--- เพิ่มบรรทัดนี้

require_once 'db.php';

// ปรับ Query ให้แน่ใจว่าดึงข้อมูลได้ถูกต้อง
$sql = "SELECT * FROM transactions ORDER BY id DESC"; // หรือ ORDER BY created_at DESC
$result = $conn->query($sql);

$transactions = array();

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }
}

// ส่ง JSON ออกไปพร้อมรองรับภาษาไทย
echo json_encode($transactions, JSON_UNESCAPED_UNICODE);
?>
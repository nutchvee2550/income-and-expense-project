<?php
// กำหนด Header สำหรับ CORS และ JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $id = (int) $data->id;

    // 1. ลบรายการที่เลือก
    $sql = "DELETE FROM transactions WHERE id = $id";

    if ($conn->query($sql)) {

        // 2. ตรวจสอบจำนวนข้อมูลที่เหลืออยู่ในตาราง
        $checkSql = "SELECT COUNT(*) as total FROM transactions";
        $result = $conn->query($checkSql);
        $row = $result->fetch_assoc();

        if ($row['total'] == 0) {
            // 🟢 กรณีที่ 1: ลบจนไม่เหลือข้อมูลแล้ว -> รีเซ็ต AUTO_INCREMENT กลับมาเริ่มที่ 1
            $conn->query("ALTER TABLE transactions AUTO_INCREMENT = 1");
        } else {
            // 🟢 กรณีที่ 2: ยังมีข้อมูลเหลืออยู่ -> จัดเรียง ID ใหม่ให้รัน 1, 2, 3... ติดกัน
            $conn->query("SET @count = 0");
            $conn->query("UPDATE transactions SET id = (@count:= @count + 1)");

            // ปรับตัวรัน AUTO_INCREMENT ของแถวถัดไปให้ต่อจาก ID สูงสุดปัจจุบัน
            $maxIdResult = $conn->query("SELECT MAX(id) as max_id FROM transactions");
            $maxRow = $maxIdResult->fetch_assoc();
            $nextAutoIncrement = $maxRow['max_id'] + 1;
            $conn->query("ALTER TABLE transactions AUTO_INCREMENT = $nextAutoIncrement");
        }

        echo json_encode(["status" => "success", "message" => "ลบข้อมูลและรีเซ็ต ID เรียบร้อย"]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "ไม่พบ ID"]);
}
?>
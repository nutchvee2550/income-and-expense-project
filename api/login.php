<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->password)) {
    
    // 1. ตรวจสอบสิทธิ์ Admin
    if ($data->username === "admin" && $data->password === "1234") {
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "user" => ["username" => "admin", "role" => "admin"]
        ]);
    } 
    // 2. เพิ่มสิทธิ์ User ทั่วไปตรงนี้
    else if ($data->username === "user" && $data->password === "1234") {
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "user" => ["username" => "weerasan", "role" => "user"]
        ]);
    } 
    else {
        echo json_encode([
            "status" => "error",
            "message" => "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
        ]);
    }

} else {
    echo json_encode([
        "status" => "error",
        "message" => "กรุณากรอกข้อมูลให้ครบถ้วน"
    ]);
}
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

include_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name)) {
    $name = $conn->real_escape_string($data->name);
    $type = isset($data->type) ? $conn->real_escape_string($data->type) : 'expense';
    $icon = isset($data->icon) && !empty($data->icon) ? $conn->real_escape_string($data->icon) : '📦';

    $sql = "INSERT INTO categories (name, type, icon) VALUES ('$name', '$type', '$icon')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "เพิ่มหมวดหมู่สำเร็จ"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "กรุณากรอกชื่อหมวดหมู่"]);
}
?>
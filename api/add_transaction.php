<?php
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->type) && !empty($data->category) && !empty($data->amount)) {
    $type = $conn->real_escape_string($data->type);
    $category = $conn->real_escape_string($data->category);
    $amount = (float) $data->amount;
    $note = isset($data->note) ? $conn->real_escape_string($data->note) : '';

    $sql = "INSERT INTO transactions (type, category, amount, note) VALUES ('$type', '$category', '$amount', '$note')";

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success", "message" => "เพิ่มข้อมูลเรียบร้อย"]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "ข้อมูลไม่ครบถ้วน"]);
}
?>
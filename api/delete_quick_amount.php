<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

// รับค่า id จาก React Body (JSON)
$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id']) ? $data['id'] : (isset($_REQUEST['id']) ? $_REQUEST['id'] : null);

if (!$id) {
    echo json_encode(["status" => "error", "message" => "No ID provided"]);
    exit();
}

$sql = "DELETE FROM quick_amounts WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Deleted successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
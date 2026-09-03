<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['amount']) && is_numeric($data['amount'])) {
    $amount = floatval($data['amount']);

    $stmt = $conn->prepare("INSERT INTO quick_amounts (amount) VALUES (?)");
    $stmt->bind_param("d", $amount);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Added successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid amount input"]);
}
$conn->close();
?>
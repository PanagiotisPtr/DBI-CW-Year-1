<?php
// Create connection
$conn = new mysqli("mysql.cs.nott.ac.uk", "psypp3", "*************", "psypp3");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("select mvTitle, mvPrice, mvYear, mvGenre from Movie;");

echo "{\n";
$nrows = $result->num_rows;
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $nrows = $nrows - 1;
        echo "  \"" . $row["mvTitle"] . "\": {\n";
        echo "    \"price\": " . $row["mvPrice"] . ",\n";
        echo "    \"Year\": " . $row["mvYear"] . ",\n";
        echo "    \"Movie Genre\": \"" . $row["mvGenre"] . "\"\n";

        if($nrows != 0) {
            echo "  },\n";
        }else {
            echo "  }\n";
        }
    }
} else {
    echo "0 results";
}
echo "}";
$conn->close();
?>
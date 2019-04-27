<?php
// Create connection
$conn = new mysqli("host", "username", "password", "database");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("select actName from Actor;");

echo "{\n";
$nrows = $result->num_rows;
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $nrows = $nrows - 1;
        echo "  \"" . $row["actName"] . "\": [\n";

        $mv_query = "select mvTitle from Movie
        where actID in
        (select actID from Actor 
        where actName like \"" . $row["actName"] . "\");";
        
        $movies = $conn->query($mv_query);
        $nmovies = $movies->num_rows;
        while($movie = $movies->fetch_assoc()) {
            $nmovies = $nmovies - 1;
            echo "    \"" . $movie["mvTitle"] . "\"";
            if ($nmovies != 0)
                echo ",";
            echo "\n";
        }

        echo "  ]";
        if ($nrows != 0)
            echo ",";
        echo "\n";
    }
} else {
    echo "0 results";
}
echo "}";
$conn->close();
?>
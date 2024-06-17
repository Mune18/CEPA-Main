<?php
// POST Method

require_once "global.php"; 
require_once 'C:/xampp/htdocs/CEPA-Main/vendor/autoload.php';

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use Firebase\JWT\JWT;
use chillerlan\QRCode\QROptions;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Logo\Logo;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Writer\ValidationException;


class Post extends GlobalMethods{
    private $pdo;

    public function __construct(\PDO $pdo){
        $this->pdo = $pdo;
    }
    
    /**
     * Add a new with the provided data.
     *
     * @param array|object $data
     *   The data representing the new.
     *
     * @return array|object
     *   The added data.
     */

     //Enter the public function below
    public function login($data) {
        // Extract ID and password from the request data
        $id = isset($data->id) ? $data->id : null;
        $password = isset($data->password) ? $data->password : null;

        // Check if ID and password are provided
        if (!$id || !$password) {
            // Return error response if ID or password is missing
            return array('error' => 'ID and password are required');
        }

        // Perform the authentication logic by querying the database
        // Check if the provided ID and password match any record in the admin_login table
        $stmt = $this->pdo->prepare("SELECT * FROM admin_login WHERE id = ? AND password = ?");
        $stmt->execute([$id, $password]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($admin) {
            // Admin found, generate a dynamic secret key
    // Generate a dynamic secret key
    $secret_key = bin2hex(random_bytes(32)); // Generate a 32-byte (256-bit) key and convert it to hexadecimal format

    // Define the algorithm
    $algorithm = 'HS256'; // Example algorithm, you can choose the appropriate one based on your requirements

    // Generate JWT token with 1-day expiration
    $payload = array(
        "id" => $admin['id'],
        "exp" => time() + (60 * 60 * 24) // Token expiration time (1 day)
    );
    $jwt = JWT::encode($payload, $secret_key, $algorithm);

    // Return success response with JWT token
    return array('success' => 'Login successful', 'token' => $jwt);
        } else {
            // No admin found with the provided ID and password, return error response
            return array('error' => 'Invalid ID or password');
        }
    }

    

    public function add_event($data) {
        $sql = "INSERT INTO events(event_name, event_date, event_location, organizer, description) VALUES (?,?,?,?,?)";
    
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([
    
                $data->event_name,
                $data->event_date,
                $data->event_location,
                $data->organizer,
                $data->description

            ]);
            return $this->sendPayload(null, "success", "Successfully created a new event.", 200);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
        }
        return $this->sendPayload(null, "failed", $errmsg, 400);
    }
    

    public function submit_feedback($data) {
        $sql = "INSERT INTO feedback(q1_answer, q2_answer, q3_answer, q4_answer, q5_answer, feedback) 
                VALUES (?, ?, ?, ?, ?, ?)";
        
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([
                $data->q1_answer,
                $data->q2_answer,
                $data->q3_answer,
                $data->q4_answer,
                $data->q5_answer,
                $data->feedback
            ]);
            
            // Return a JSON response indicating success
            return json_encode(["status" => "success", "message" => "Successfully created a new feedback record."]);
        } catch(\PDOException $e) {
            // Return a JSON response indicating failure with error message
            return json_encode(["status" => "failed", "message" => $e->getMessage()]);
        }
    }
    public function edit_participant($data) {
        $sql = "UPDATE participants SET first_name=?, last_name=?, email=?, phone_number=?, address=? WHERE participant_id=?";
        
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([
                $data->participant_id, // Assuming participant_id is included in $data
                $data->first_name,
                $data->last_name,
                $data->email,
                $data->phone_number,
                $data->address
            ]);
            return $this->sendPayload(null, "success", "Successfully updated participant information.", 200);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "failed", $errmsg, 400);
        }
    }

      //Send Email no template
    //  public function sendEmail($data){
    //     // Check if $data is null
    //     if ($data === null) {
    //         return ['success' => false, 'message' => 'Data is null'];
    //     }
    
    //     // Debug autoload
    //     $mail = new PHPMailer(true);
    
    //     try {
    //         // Configure SMTP settings
    //         $mail->isSMTP();                                            //Send using SMTP
    //         $mail->Host       = 'smtp.gmail.com';                       //Set the SMTP server to send through
    //         $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    //         $mail->Username   = 'cepa.appdev@gmail.com';                //SMTP username
    //         $mail->Password   = 'iiot dgrb rlxw mcas';                  //SMTP password
    //         $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    //         $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
    
    //         // Set email content
    //         $mail->setFrom('cepa.appdev@gmail.com', 'CEPA');
    
    //         // Check if $data->to is set
    //         if (isset($data->to)) {
    //             $mail->addAddress($data->to);
    //         } else {
    //             return ['success' => false, 'message' => 'Recipient email is not provided'];
    //         }
    
    //         // Check if $data->subject is set
    //         if (isset($data->subject)) {
    //             $mail->Subject = $data->subject;
    //         } else {
    //             return ['success' => false, 'message' => 'Email subject is not provided'];
    //         }
    
    //         // Check if $data->message is set
    //         if (isset($data->message)) {
    //             $mail->Body = $data->message;
    //             $mail->isHTML(true); // Set email as HTML
    //         } else {
    //             return ['success' => false, 'message' => 'Email message is not provided'];
    //         }
    
    //         // Send email
    //         $mail->send();
    //         return ['success' => true, 'message' => 'Email sent successfully'];
    //     } catch (Exception $e) {
    //         return ['success' => false, 'message' => 'Failed to send email: ' . $mail->ErrorInfo];
    //     }
    // }
    
// Enter public function below
public function sendEmail($data, $template = 'default') {
    // Check if $data is null
    if ($data === null) {
        return ['success' => false, 'message' => 'Data is null'];
    }

    // Extract eventId from qrCodeImageUrl
    $pattern = '/attendance\/(\d+)/';
    preg_match($pattern, $data->qrCodeImageUrl, $matches);
    $eventId = isset($matches[1]) ? $matches[1] : null;

    // Check if eventId is extracted successfully
    if ($eventId === null) {
        return ['success' => false, 'message' => 'Event ID not found in QR code URL'];
    }

    // Construct the QR code data
    $qrCodeData = 'http://itcepacommunity.com/attendance/' . $eventId;

    // Generate the QR code using the builder
    $qrCode = Builder::create()
        ->writer(new PngWriter())
        ->data($qrCodeData)
        ->encoding(new Encoding('UTF-8'))
        ->errorCorrectionLevel(ErrorCorrectionLevel::High)
        ->size(150)
        ->margin(10)
        ->validateResult(false)
        ->build();

    // Get the QR code image data
    $qrCodeContent = $qrCode->getString();
    $qrCodeImageUrl = 'data:image/png;base64,' . base64_encode($qrCodeContent);

    // Define the path for the temporary QR code image
    $tempDir = 'C:\xampp\htdocs\CEPA-Main\temp';
    $tempImagePath = $tempDir . '\qr_code.png';

    // Ensure the temp directory exists
    if (!is_dir($tempDir)) {
        mkdir($tempDir, 0777, true);
    }

    // Save the QR code image to a file
    file_put_contents($tempImagePath, $qrCodeContent);

    // Initialize PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Configure SMTP settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'cepa.appdev@gmail.com';
        $mail->Password   = 'iiot dgrb rlxw mcas';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // Set sender
        $mail->setFrom('cepa.appdev@gmail.com', 'CEPA');

        // Set recipient
        if (isset($data->to)) {
            $mail->addAddress($data->to);
        } else {
            return ['success' => false, 'message' => 'Recipient email is not provided'];
        }

        // Set subject
        if (isset($data->subject)) {
            $mail->Subject = $data->subject;
        } else {
            return ['success' => false, 'message' => 'Email subject is not provided'];
        }

        // Load email content template
        $templateFile = __DIR__ . '/../template/' . $template . '.php';
        if (!file_exists($templateFile)) {
            return ['success' => false, 'message' => 'Template not found'];
        }

        // Prepare template data
        $templateData = [
            'message' => $data->message, // Pass the message from $data to the template
            'qrCodeData' => $qrCodeData // Pass other necessary data to the template
        ];

        // Load the template and replace placeholders with actual data
        ob_start();
        extract($templateData);
        include $templateFile;
        $emailContent = ob_get_clean();
        
        // var_dump($emailContent);

        // Set email content
        $mail->isHTML(true); 
        $mail->Body = $emailContent;

        // Attach the QR code image
        $mail->AddEmbeddedImage($tempImagePath, 'qr_code_image');

        // Send email
        $mail->send();
        return ['success' => true, 'message' => 'Email sent successfully'];

        // Delete the temporary QR code image
        if (file_exists($tempImagePath)) {
            unlink($tempImagePath);
        }
    } catch (Exception $e) {
        // Log error
        error_log('Failed to send email: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Failed to send email: ' . $e->getMessage()];
    }
}


    public function submit_registration($data) {
        // Check if the participant is already registered for the event
        if ($this->isAlreadyRegistered($data->id, $data->event_id)) {
            return json_encode([
                "status" => "error",
                "message" => "Already registered for this event."
            ]);
        }

        // Check if participant exists, if not, insert them
        $participantId = $this->insertParticipant($data);

        // Construct the SQL query to insert registration data
        $sql = "INSERT INTO registrants (user_id, event_id, participant_id, l_name, f_name, email, idnumber) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";

        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([
                $data->id,
                $data->event_id,
                $participantId,
                $data->lastname,
                $data->firstname,
                $data->email,
                $data->idnumber
            ]);

            // Return a success message in JSON format
            return json_encode([
                "status" => "success",
                "message" => "Successfully registered for the event."
            ]);
        } catch (\PDOException $e) {
            // Return an error message in JSON format
            return json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }

    private function isAlreadyRegistered($user_id, $event_id) {
        $sql = "SELECT * FROM registrants WHERE user_id = ? AND event_id = ?";

        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$user_id, $event_id]);
            return $statement->fetch(PDO::FETCH_ASSOC) !== false;
        } catch (\PDOException $e) {
            // Handle query error
            return false;
        }
    }

    private function insertParticipant($data) {
        // Check if the participant already exists by user_id
        $existingParticipant = $this->getParticipantByUserId($data->id);
    
        if ($existingParticipant) {
            // Participant already exists, return their ID
            return $existingParticipant['participant_id'];
        } else {
            // Participant doesn't exist, insert them and return their ID
            $sql = "INSERT INTO participants (first_name, last_name, email, idnumber, user_id) 
                    VALUES (?, ?, ?, ?, ?)";
    
            try {
                $statement = $this->pdo->prepare($sql);
                $statement->execute([
                    $data->firstname,
                    $data->lastname,
                    $data->email,
                    $data->idnumber,
                    $data->id // user_id field
                ]);
    
                // Return the auto-generated participant ID
                return $this->pdo->lastInsertId();
            } catch(\PDOException $e) {
                // Handle participant insertion error
                return null;
            }
        }
    }    
    

    private function getParticipantByUserId($user_id) {
        $sql = "SELECT * FROM participants WHERE user_id = ?";
    
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$user_id]);
            return $statement->fetch(PDO::FETCH_ASSOC);
        } catch(\PDOException $e) {
            // Handle participant fetch error
            return null;
        }
    }
    
    public function update_event($eventId, $data) {
        $sql = "UPDATE events SET event_name=?, event_date=?, event_location=?, organizer=?, description=? WHERE event_id=?";
        
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([
                $data->event_name,
                $data->event_date,
                $data->event_location,
                $data->organizer,
                $data->description,
                $eventId // Use the provided event ID parameter
            ]);
            return $this->sendPayload(null, "success", "Successfully updated the event.", 200);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
        }
        return $this->sendPayload(null, "failed", $errmsg, 400);
    }

    public function archiveParticipant($data) {
        $sql = "UPDATE participants SET isArchived = 1 WHERE participant_id = ?";
        
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$data->participant_id]);
            return $this->sendPayload(null, "success", "Successfully archived participant.", 200);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "failed", $errmsg, 400);
        }
    }

    public function archive_event($event_id) {
        $sql = "UPDATE events SET archived=1 WHERE event_id=?";
        
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$event_id]);
            return $this->sendPayload(null, "success", "Successfully archived the event.", 200);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
        }
        return $this->sendPayload(null, "failed", $errmsg, 400);
    }

    public function update_participant($participantId, $data) {
        // Ensure no trailing comma in the SQL query
        $sql = "UPDATE participants SET first_name=?, last_name=?, email=?, phone_number=? WHERE participant_id=?";
        
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute([
                $data->first_name,
                $data->last_name,
                $data->email,
                $data->phone_number,
                $participantId // Use the provided participant ID parameter
            ]);
            return $this->sendPayload(null, "success", "Successfully updated the participant.", 200);
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "failed", $errmsg, 400);
        }
    }

    public function userLogin($data) {
        $idnumber = isset($data->idnumber) ? $data->idnumber : null;
        $password = isset($data->password) ? $data->password : null;
    
        if (!$idnumber || !$password) {
            return array('error' => 'ID Number and password are required');
        }
    
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE idnumber = ?");
        $stmt->execute([$idnumber]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($user && password_verify($password, $user['password'])) {
            $secret_key = bin2hex(random_bytes(32));
            $algorithm = 'HS256';
            $payload = array(
                "id" => $user['id'],
                "exp" => time() + (60 * 60 * 24)
            );
            $jwt = JWT::encode($payload, $secret_key, $algorithm);
    
            return array('success' => 'Login successful', 'token' => $jwt, 'user' => $user); // Return user information along with the token
        } else {
            return array('error' => 'Invalid ID Number or password');
        }
    }

    public function register($data) {
        $firstname = isset($data->firstname) ? $data->firstname : null;
        $lastname = isset($data->lastname) ? $data->lastname : null;
        $idnumber = isset($data->idnumber) ? $data->idnumber : null;
        $email = isset($data->email) ? $data->email : null;
        $password = isset($data->password) ? $data->password : null;
        $gender = isset($data->gender) ? $data->gender : null;

        if (!$firstname || !$lastname || !$idnumber || !$email || !$password || !$gender) {
            return array('status' => 'error', 'message' => 'All fields are required');
        }

        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE idnumber = ? OR email = ?");
        $stmt->execute([$idnumber, $email]);
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            return array('status' => 'error', 'message' => 'User already exists');
        }

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $this->pdo->prepare("INSERT INTO users (firstname, lastname, idnumber, email, password, gender) VALUES (?, ?, ?, ?, ?, ?)");
        if ($stmt->execute([$firstname, $lastname, $idnumber, $email, $hashedPassword, $gender])) {
            return array('status' => 'success', 'message' => 'User registered successfully');
        } else {
            return array('status' => 'error', 'message' => 'Failed to register user');
        }
    }
    
    public function insert_user_info($data) {
        // Check if all required fields are provided
        if (
            !isset($data->user_id) || !isset($data->college_program) ||
            !isset($data->phone_number) || !isset($data->date_of_birth) ||
            !isset($data->place_of_birth) || !isset($data->gender) ||
            !isset($data->sexual_orientation) || !isset($data->gender_identity)
        ) {
            return array('status' => 'error', 'message' => 'Incomplete data provided');
        }
    
        // Check if the user_id already exists in the database
        $check_sql = "SELECT COUNT(*) FROM user_info WHERE user_id = :user_id";
        $check_stmt = $this->pdo->prepare($check_sql);
        $check_stmt->execute([':user_id' => $data->user_id]);
        $exists = $check_stmt->fetchColumn();
    
        if ($exists) {
            // Update existing record
            $sql = "UPDATE user_info SET 
                        college_program = :college_program, 
                        phone_number = :phone_number, 
                        date_of_birth = :date_of_birth, 
                        place_of_birth = :place_of_birth, 
                        gender = :gender, 
                        sexual_orientation = :sexual_orientation, 
                        gender_identity = :gender_identity 
                    WHERE user_id = :user_id";
        } else {
            // Insert new record
            $sql = "INSERT INTO user_info (user_id, college_program, phone_number, date_of_birth, place_of_birth, gender, sexual_orientation, gender_identity) 
                    VALUES (:user_id, :college_program, :phone_number, :date_of_birth, :place_of_birth, :gender, :sexual_orientation, :gender_identity)";
        }
    
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':user_id' => $data->user_id,
                ':college_program' => $data->college_program,
                ':phone_number' => $data->phone_number,
                ':date_of_birth' => $data->date_of_birth,
                ':place_of_birth' => $data->place_of_birth,
                ':gender' => $data->gender,
                ':sexual_orientation' => $data->sexual_orientation,
                ':gender_identity' => $data->gender_identity
            ]);
    
            return array('status' => 'success', 'message' => 'User info inserted/updated successfully');
        } catch (PDOException $e) {
            return array('status' => 'error', 'message' => $e->getMessage());
        }
    }
    
}
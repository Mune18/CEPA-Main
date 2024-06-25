<?php
// Retrieving records from database
require_once "global.php";

class Get extends GlobalMethods{
    private $pdo;

    public function __construct(\PDO $pdo){
        $this->pdo = $pdo;
    }

    public function executeQuery($sql){
        $data = array(); //place to store records retrieved for db
        $errmsg = ""; //initialized error message variable
        $code = 0; //initialize status code variable

        try{
            if($result = $this->pdo->query($sql)->fetchAll()){ //retrieved records from db, returns false if no records found
                foreach($result as $record){
                    array_push($data, $record);
                }
                $code = 200;
                $result = null;
                return array("code"=>$code, "data"=>$data);
            }
            else{
                //if no record found, assign corresponding values to error messages/status
                $errmsg = "No records found";
                $code = 404;
            }
        }
        catch(\PDOException $e){
            //PDO errors, mysql errors
            $errmsg = $e->getMessage();
            $code = 403;
        }
        return array("code"=>$code, "errmsg"=>$errmsg);
    }

    //Enter the public function below
    public function get_records($table, $condition=null){
        $sqlString = "SELECT * FROM $table";
        if($condition != null){
            $sqlString .= " WHERE " . $condition;
        }
        
        $result = $this->executeQuery($sqlString);

        if($result['code']==200){
            return $this->sendPayload($result['data'], "success", "Successfully retrieved records.", $result['code']);
        }
        
        return $this->sendPayload(null, "failed", "Failed to retrieve records.", $result['code']);
    }

    public function get_events() {
        $response = $this->get_records('events', null);
        return $response;
    }   
    
    public function get_events_userside() {
        $condition = "archived = 0"; // Condition to filter out archived events
        $response = $this->get_records('events', $condition);
        return $response;
    }  

    public function get_info() {
        $sql = "SELECT * FROM participants WHERE isArchived = 0"; // Select non-archived participants
        $stmt = $this->pdo->prepare($sql);
        
        try {
            $stmt->execute();
            $participants = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $participants;
        } catch (PDOException $e) {
            // Handle any potential errors
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }    
    
    public function get_attendees($eventId) {
        try {
            // Prepare SQL statement to fetch registrants data for the specified event ID
            $sql = "SELECT * FROM registrants WHERE event_id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$eventId]);
            
            // Fetch all attendance records for the specified event ID
            $attendanceData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Return the fetched attendance data
            return $attendanceData;
        } catch(PDOException $e) {
            // Handle any potential errors
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }


    public function get_attendance_for_event($eventId) {
        try {
            // Prepare SQL statement to fetch attendance data for the specified event ID
            $sql = "SELECT * FROM registrants WHERE event_id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$eventId]);
            
            // Fetch all attendance records for the specified event ID
            $attendanceData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Return the fetched attendance data
            return $attendanceData;
        } catch(PDOException $e) {
            // Handle any potential errors
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }

    public function get_participant_by_name($name) {
        try {
            $sql = "SELECT p.first_name, p.last_name, e.event_name, e.event_date, e.event_location, e.organizer
                    FROM participants p
                    JOIN registrants a ON p.participant_id = a.participant_id
                    JOIN events e ON a.event_id = e.event_id
                    WHERE p.first_name LIKE ? OR p.last_name LIKE ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(["%$name%", "%$name%"]);
            
            $participants = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $participantName = $row['first_name'] . ' ' . $row['last_name'];
                if (!isset($participants[$participantName])) {
                    $participants[$participantName] = [
                        'first_name' => $row['first_name'],
                        'last_name' => $row['last_name'],
                        'events' => []
                    ];
                }
                $participants[$participantName]['events'][] = [
                    'event_name' => $row['event_name'],
                    'event_date' => $row['event_date'],
                    'event_location' => $row['event_location'], // Include event location
                    'organizer' => $row['organizer'] // Include organizer
                ];
            }
            
            return array_values($participants);
        } catch(PDOException $e) {
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }

    public function get_events_with_participant_counts() {
        try {
            $sql = "SELECT e.event_id, e.event_name, e.event_date, e.event_location, e.organizer, COUNT(a.participant_id) AS participant_count
                    FROM events e
                    LEFT JOIN registrants a ON e.event_id = a.event_id
                    GROUP BY e.event_id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();

            $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $events;
        } catch(PDOException $e) {
            // Handle any potential errors
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }

    public function get_participants(){
        $response = $this->get_records('participants',null);
        return $response;
    }
    
    public function get_totalEvents(){
        $response = $this->get_records('events',null);
        return $response;
    }

    // Inside the Get class
    public function getMostParticipatedEvent() {
        try {
            $query = "SELECT e.event_name, COUNT(a.participant_id) as participant_count 
                    FROM events e 
                    JOIN registrants a ON e.event_id = a.event_id 
                    GROUP BY e.event_name 
                    ORDER BY participant_count DESC 
                    LIMIT 1";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $result;
        } catch (PDOException $e) {
            // Handle database connection errors
            return array('error' => 'Database error: ' . $e->getMessage());
        }
    }

    public function get_feedback_data() {
        $stmt = $this->pdo->prepare("SELECT `id`, `q1_answer`, `q2_answer`, `q3_answer`, `q4_answer`, `q5_answer`, `feedback`, `created_at` FROM `feedback`");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function get_user_details($userId) {
        try {
            $sql = "SELECT * FROM users WHERE id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId]);
            $userDetails = $stmt->fetch(PDO::FETCH_ASSOC);
    
            // Unset the password field
            if ($userDetails) {
                unset($userDetails['password']);
            }
    
            return $userDetails;
        } catch(PDOException $e) {
            // Handle any potential errors
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }    
    
    public function get_additional_user_info($userId) {
        try {
            $sql = "SELECT * FROM user_info WHERE user_id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId]);
            $userInfo = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $userInfo ? $userInfo : null;
        } catch(PDOException $e) {
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }    

    public function getEventsJoined($userId) {
        try {
            $sql = "SELECT e.event_id, e.event_name, e.event_date, e.event_location, e.organizer
                    FROM events e
                    JOIN registrants r ON e.event_id = r.event_id
                    JOIN participants p ON r.participant_id = p.participant_id
                    WHERE p.user_id = ?";
    
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId]);
    
            // Check for errors
            $errorInfo = $stmt->errorInfo();
            if ($errorInfo[0] !== '00000') {
                throw new PDOException("PDO Error: " . $errorInfo[2]);
            }
    
            // Fetch all rows
            $eventsJoined = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            // Return fetched events or handle empty result case
            if (empty($eventsJoined)) {
                return [
                    "status" => "success",
                    "message" => "No events joined by user",
                    "data" => []
                ];
            } else {
                return [
                    "status" => "success",
                    "data" => $eventsJoined
                ];
            }
        } catch(PDOException $e) {
            // Log the error for debugging purposes
            error_log("PDO Exception: " . $e->getMessage());
    
            // Return error response
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
        
    }
    
    public function get_participant_info($user_id) {
        try {
            $sql = "SELECT college_program, phone_number, date_of_birth, place_of_birth, gender, sexual_orientation, gender_identity
                    FROM user_info 
                    WHERE user_id = :user_id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->execute();
    
            $user_info = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user_info) {
                return [
                    "status" => "success",
                    "data" => $user_info
                ];
            } else {
                return [
                    "status" => "error",
                    "message" => "User not found"
                ];
            }
        } catch(PDOException $e) {
            // Log the error for debugging purposes
            error_log("PDO Exception: " . $e->getMessage());
    
            // Return error response
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }
    public function get_submission($eventId, $userId) {
        try {
            $sql = "SELECT event_id, event_name, feedback, attendance_proof, status FROM attendance_proof WHERE event_id = ? AND user_id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$eventId, $userId]);
            $submission = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($submission) {
                return [
                    'status' => 'success',
                    'data' => $submission
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'No submission found.'
                ];
            }
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    public function view_submissions($eventId) {
        try {
            // Prepare SQL statement to fetch attendance data for the specified event ID
            $sql = "SELECT * FROM attendance_proof WHERE event_id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$eventId]);
            
            // Fetch all attendance records for the specified event ID
            $attendanceData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Return the fetched attendance data
            return $attendanceData;
        } catch(PDOException $e) {
            // Handle any potential errors
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }

    public function get_attendees_list($eventId) {
        try {
            $sql = "SELECT * FROM attendance_proof WHERE status = 'Approved' AND event_id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$eventId]);
    
            $attendees = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            return $attendees;
        } catch (PDOException $e) {
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }
    

    public function get_attendance_proof_data($eventId) {
        try {
            // Prepare SQL statement to fetch attendance proof data for the specified event ID
            $sql = "SELECT * FROM attendance_proof WHERE event_id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$eventId]);
            
            // Fetch all attendance proof records for the specified event ID
            $attendanceProofData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Return the fetched attendance proof data
            return $attendanceProofData;
        } catch(PDOException $e) {
            // Handle any potential errors
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }
}

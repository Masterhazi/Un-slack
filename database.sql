CREATE DATABASE eisenhower_matrix;
USE eisenhower_matrix;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    quadrant ENUM('DO', 'SCHEDULE', 'DELEGATE', 'ELIMINATE') NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME DEFAULT NULL
);

DELIMITER //
CREATE TRIGGER set_completed_at BEFORE UPDATE ON tasks
FOR EACH ROW
BEGIN
    IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
        SET NEW.completed_at = NOW();
    ELSEIF NEW.completed = FALSE AND OLD.completed = TRUE THEN
        SET NEW.completed_at = NULL;
    END IF;
END;
//
DELIMITER ;

CREATE EVENT IF NOT EXISTS delete_old_completed_tasks
ON SCHEDULE EVERY 1 HOUR
DO
  DELETE FROM tasks WHERE completed = TRUE AND completed_at < NOW() - INTERVAL 24 HOUR;

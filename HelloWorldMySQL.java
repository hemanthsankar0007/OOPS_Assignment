package com.myapp.helloworld;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class HelloWorldMySQL {

    static final String URL = "jdbc:mysql://localhost:3306/testdb1?useSSL=false&serverTimezone=UTC";
    static final String USER = "root";
    static final String PASS = "Homelander@123";

    public static void main(String[] args) {
        System.out.println("Hello, World!");

        // Sample data
        String firstName = "Alice";
        String lastName = "Johnson";
        int age = 30;
        String mobile = "9876543210";
        String college = "Springfield University";
        String branch = "Computer Science";
        String subject1 = "Maths";
        int marks1 = 85;
        String subject2 = "Physics";
        int marks2 = 78;
        String subject3 = "Chemistry";
        int marks3 = 92;

        insertPerson(firstName, lastName, age, mobile, college, branch, subject1, marks1, subject2, marks2, subject3, marks3);
    }

    public static void insertPerson(String firstName, String lastName, int age,
                                    String mobile, String college, String branch,
                                    String subject1, int marks1,
                                    String subject2, int marks2,
                                    String subject3, int marks3) {

        String sql = "INSERT INTO persons (first_name, last_name, age, mobile, college, branch, " +
                     "subject1, marks1, subject2, marks2, subject3, marks3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, firstName);
            pstmt.setString(2, lastName);
            pstmt.setInt(3, age);
            pstmt.setString(4, mobile);
            pstmt.setString(5, college);
            pstmt.setString(6, branch);
            pstmt.setString(7, subject1);
            pstmt.setInt(8, marks1);
            pstmt.setString(9, subject2);
            pstmt.setInt(10, marks2);
            pstmt.setString(11, subject3);
            pstmt.setInt(12, marks3);

            int rows = pstmt.executeUpdate();
            if (rows > 0) {
                System.out.println("A new person was inserted successfully!");
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

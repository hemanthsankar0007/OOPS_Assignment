package com.myapp.helloworld;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class PersonForm extends JFrame {

    private JTextField firstNameField, lastNameField, ageField, mobileField, collegeField, branchField;
    private JTextField subject1Field, marks1Field, subject2Field, marks2Field, subject3Field, marks3Field;
    private JButton submitButton;

    static final String URL = "jdbc:mysql://localhost:3306/testdb1?useSSL=false&serverTimezone=UTC";
    static final String USER = "root";
    static final String PASS = "Homelander@123";

    public PersonForm() {
        super("Student Entry Form");

        // Set background color
        getContentPane().setBackground(new Color(235, 245, 255));

        // Layout setup
        setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Form fields
        firstNameField = addLabeledField("First Name:", gbc, 0);
        lastNameField = addLabeledField("Last Name:", gbc, 1);
        ageField = addLabeledField("Age:", gbc, 2);
        mobileField = addLabeledField("Mobile Number:", gbc, 3);
        collegeField = addLabeledField("College Name:", gbc, 4);
        branchField = addLabeledField("Branch Name:", gbc, 5);
        subject1Field = addLabeledField("Subject 1:", gbc, 6);
        marks1Field = addLabeledField("Marks 1:", gbc, 7);
        subject2Field = addLabeledField("Subject 2:", gbc, 8);
        marks2Field = addLabeledField("Marks 2:", gbc, 9);
        subject3Field = addLabeledField("Subject 3:", gbc, 10);
        marks3Field = addLabeledField("Marks 3:", gbc, 11);

        submitButton = new JButton("Submit");
        gbc.gridx = 1;
        gbc.gridy = 12;
        add(submitButton, gbc);

        submitButton.addActionListener(e -> insertPerson());

        // JFrame settings
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        pack();
        setLocationRelativeTo(null);
        setVisible(true);
    }

    private JTextField addLabeledField(String label, GridBagConstraints gbc, int yPos) {
        JLabel jLabel = new JLabel(label);
        jLabel.setForeground(Color.DARK_GRAY);
        gbc.gridx = 0;
        gbc.gridy = yPos;
        add(jLabel, gbc);

        JTextField field = new JTextField(20);
        gbc.gridx = 1;
        add(field, gbc);
        return field;
    }

    private void insertPerson() {
        try {
            String firstName = firstNameField.getText().trim();
            String lastName = lastNameField.getText().trim();
            int age = Integer.parseInt(ageField.getText().trim());
            String mobile = mobileField.getText().trim();
            String college = collegeField.getText().trim();
            String branch = branchField.getText().trim();
            String subject1 = subject1Field.getText().trim();
            int marks1 = Integer.parseInt(marks1Field.getText().trim());
            String subject2 = subject2Field.getText().trim();
            int marks2 = Integer.parseInt(marks2Field.getText().trim());
            String subject3 = subject3Field.getText().trim();
            int marks3 = Integer.parseInt(marks3Field.getText().trim());

            try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
                 PreparedStatement pstmt = conn.prepareStatement(
                         "INSERT INTO persons (first_name, last_name, age, mobile, college, branch, subject1, marks1, subject2, marks2, subject3, marks3) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")) {

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
                    JOptionPane.showMessageDialog(this, "Data inserted successfully!");
                    clearFields();
                }

            } catch (SQLException ex) {
                ex.printStackTrace();
                JOptionPane.showMessageDialog(this, "Database Error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }

        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Please fill all fields correctly.", "Input Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void clearFields() {
        JTextField[] fields = { firstNameField, lastNameField, ageField, mobileField, collegeField, branchField,
                subject1Field, marks1Field, subject2Field, marks2Field, subject3Field, marks3Field };

        for (JTextField field : fields) {
            field.setText("");
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(PersonForm::new);
    }
}

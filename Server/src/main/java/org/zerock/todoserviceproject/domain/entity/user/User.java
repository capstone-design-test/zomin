package org.zerock.todoserviceproject.domain.entity.user;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder; 
import lombok.Getter;
import lombok.NoArgsConstructor; 
import lombok.Setter;

@Entity
@Table(name = "userdb") 
@Getter
@Setter
@NoArgsConstructor 
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // DB의 'id' 컬럼 (INT, PK, Auto Increment)

    @Column(name = "userid", unique = true, nullable = false, length = 255) // DB의 'userid' 컬럼 (VARCHAR), 아이디로 사용
    private String username;

    @Column(nullable = false, length = 255) // DB의 'password' 컬럼 (VARCHAR), 암호화된 비밀번호 저장
    private String password;

    @Column(name = "name", length = 255) // DB의 'name' 컬럼 (VARCHAR)
    private String name;

    @Column(name = "phone", length = 255) // DB의 'phone' 컬럼 (VARCHAR), 전화번호 저장
    private String phoneNumber;

   
    @Builder
    public User(String username, String password, String name, String phoneNumber) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

 
}
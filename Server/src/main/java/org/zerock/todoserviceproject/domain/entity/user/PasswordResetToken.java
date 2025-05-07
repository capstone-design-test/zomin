package org.zerock.todoserviceproject.domain.entity.user;

import jakarta.persistence.*; 
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime; 

@Entity
@Table(name = "password_reset_token") // 토큰 정보를 저장할 테이블 이름
@Getter
@Setter
@NoArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token; // 발급된 토큰 문자열

    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "user_id", nullable = false) 
    private User user; 

    @Column(nullable = false)
    private LocalDateTime expiryDate; // 토큰 만료 시간

    @Column(nullable = false)
    private boolean used; // 토큰 사용 여부 (한 번 사용되면 true)

    public PasswordResetToken(String token, User user, LocalDateTime expiryDate) {
        this.token = token;
        this.user = user;
        this.expiryDate = expiryDate;
        this.used = false; // 초기에는 사용되지 않음
    }

    // 토큰이 유효한지 확인하는 헬퍼 메서드
    public boolean isValid() {
        return !this.used && this.expiryDate.isAfter(LocalDateTime.now());
    }
}
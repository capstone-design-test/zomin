package org.zerock.todoserviceproject.domain.repository.login;


import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.todoserviceproject.domain.entity.user.PasswordResetToken;

import java.util.Optional; 


public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // 토큰 문자열로 토큰 정보를 찾는 메서드
    Optional<PasswordResetToken> findByToken(String token);

    
}
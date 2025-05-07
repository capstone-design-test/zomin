package org.zerock.todoserviceproject.domain.repository.login;


import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.todoserviceproject.domain.entity.user.User;


public interface UserRepository extends JpaRepository<User, Long> {
    
    // 아이디(username, DB 컬럼명 userid)로 사용자 찾기
    Optional<User> findByUsername(String username);

    // 아이디(username, DB 컬럼명 userid)의 존재 여부 확인 (아이디 중복 확인용)
    boolean existsByUsername(String username);

    //비밀번호변경 아이디,이름,전화번호 확인
     Optional<User> findByUsernameAndNameAndPhoneNumber(String username, String name, String phoneNumber);
}
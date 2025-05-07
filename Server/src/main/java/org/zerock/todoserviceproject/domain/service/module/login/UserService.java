package org.zerock.todoserviceproject.domain.service.module.login;


import org.zerock.todoserviceproject.domain.entity.user.User;
import org.zerock.todoserviceproject.domain.entity.user.PasswordResetToken; 
import org.zerock.todoserviceproject.application.dto.login.SignUpRequest;
import org.zerock.todoserviceproject.application.dto.login.PasswordVerificationRequest; 
import org.zerock.todoserviceproject.application.dto.login.PasswordVerificationResponse; 
import org.zerock.todoserviceproject.application.dto.login.PasswordResetRequest; 
import org.zerock.todoserviceproject.domain.repository.login.UserRepository;
import org.zerock.todoserviceproject.domain.repository.login.PasswordResetTokenRepository; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime; 
import java.util.Optional;
import java.util.UUID; 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    // TODO: 토큰 만료 시간 설정 (30분)
    private static final int TOKEN_EXPIRY_TIME_MINUTES = 30;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                   PasswordResetTokenRepository passwordResetTokenRepository) { 
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.passwordResetTokenRepository = passwordResetTokenRepository; 
}

    /**
     * 아이디(username)의 중복 여부를 확인합니다.
     * @param username 확인할 아이디
     * @return 아이디가 사용 가능하다면 true, 이미 존재한다면 false
     */
  
    @Transactional(readOnly = true)
    public boolean isUsernameAvailable(String username) {
        
        boolean exists = userRepository.existsByUsername(username);
        log.info("Checking availability for username: {}", username); // 기존 로깅 유지
        log.info("Username {} exists: {}", username, exists); // 기존 로깅 유지
        return !exists; // 존재하면 사용 불가 (!true = false), 존재 안 하면 사용 가능 (!false = true)
    }

    /**
     * 새로운 사용자를 등록합니다.
     * @param signUpRequest 회원가입 요청 DTO
     * @return 등록 성공 시 true, 아이디 중복 시 false
     */
     
    public boolean registerUser(SignUpRequest signUpRequest) {
        String username = signUpRequest.getUsername();

        // 아이디 중복 확인
        if (userRepository.existsByUsername(username)) {
             log.warn("Attempted to register with existing username: {}", username);
            return false; // 이미 존재하는 아이디
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(signUpRequest.getPassword());

        // User 엔티티 생성 (Builder 패턴 사용)
        User newUser = User.builder()
                .username(username)
                .password(encodedPassword)
                .name(signUpRequest.getName())
                .phoneNumber(signUpRequest.getPhoneNumber())
                .build();

        // 데이터베이스에 저장
        userRepository.save(newUser);
         log.info("User registered successfully: {}", username);
        return true; // 등록 성공
    }

    
    /**
     * 사용자 자격 증명(아이디, 비밀번호)을 검증합니다. (로그인 로직의 일부)
     * @param username 아이디
     * @param password 원문 비밀번호
     * @return 자격 증명 일치 시 true, 불일치 시 false
     */
    @Transactional(readOnly = true) 
    public boolean verifyCredentials(String username, String password) {
        log.info("Verifying credentials for username: {}", username); // 로깅 추가
        // 아이디로 사용자 찾기
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            // 사용자가 존재하지 않음
             log.warn("Login failed: User not found for username {}", username);
            return false;
        }

        User user = userOptional.get();

        // 데이터베이스에 저장된 암호화된 비밀번호와 입력된 원문 비밀번호 비교
        // passwordEncoder.matches(원문 비밀번호, 암호화된 비밀번호)
        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());

        if (passwordMatches) {
             log.info("Login successful for username {}", username);
        } else {
             log.warn("Login failed: Incorrect password for username {}", username);
        }

        return passwordMatches;
    }
    /**
     * 1단계: 비밀번호 변경을 위한 사용자 본인 확인 및 임시 토큰 발급
     * 아이디, 이름, 전화번호가 일치하는 사용자를 확인하고, 일치하면 토큰을 생성/저장 후 반환합니다.
     * @param request 본인 확인 요청 정보 (아이디, 이름, 전화번호)
     * @return 사용자 정보 일치 시 토큰을 담은 Optional<PasswordVerificationResponse>, 불일치 시 Optional.empty()
     */
    @Transactional 
    public Optional<PasswordVerificationResponse> verifyUserForPasswordChange(PasswordVerificationRequest request) {
        log.info("Attempting 1-step verification for password change for user: {}", request.getUsername());

        // 아이디, 이름, 전화번호가 모두 일치하는 사용자를 찾습니다.
        Optional<User> userOptional = userRepository.findByUsernameAndNameAndPhoneNumber(
                request.getUsername(),
                request.getName(),
                request.getPhoneNumber()
        );

        // 사용자 정보 일치 시
        if (userOptional.isPresent()) {
            User user = userOptional.get();


            // 임시 토큰 생성
            String token = UUID.randomUUID().toString();
            // 토큰 만료 시간 설정 (현재 시간 + 만료 시간)
            LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(TOKEN_EXPIRY_TIME_MINUTES);

            // PasswordResetToken 엔티티 생성 및 저장
            PasswordResetToken passwordResetToken = new PasswordResetToken(token, user, expiryDate);
            passwordResetTokenRepository.save(passwordResetToken);

            log.info("1-step verification successful. Token generated for user: {}", request.getUsername());
            // 클라이언트에게 반환할 응답 DTO 생성
            return Optional.of(new PasswordVerificationResponse(token));
        } else {
            // 사용자 정보 불일치 시
            log.warn("1-step verification failed: User not found or info mismatch for username: {}", request.getUsername());
            return Optional.empty(); // 빈 Optional 반환
        }
    }


    /**
     * 2단계: 임시 토큰 검증 후 비밀번호 변경
     * 제공된 토큰의 유효성을 검증하고, 유효하면 연결된 사용자의 비밀번호를 업데이트합니다.
     * @param request 비밀번호 변경 요청 정보 (토큰, 새로운 비밀번호)
     * @return 비밀번호 변경 성공 시 true, 토큰 유효하지 않거나 사용자 미발견 시 false
     */
    @Transactional 
    public boolean resetPassword(PasswordResetRequest request) {
        log.info("Attempting 2-step password reset using token");

        // 1. 제공된 토큰으로 PasswordResetToken 정보를 찾습니다.
        Optional<PasswordResetToken> tokenOptional = passwordResetTokenRepository.findByToken(request.getToken());

        // 토큰 정보가 존재하지 않거나 유효하지 않으면 실패
        if (tokenOptional.isEmpty() || !tokenOptional.get().isValid()) {
            log.warn("2-step password reset failed: Invalid or expired token provided.");
            return false;
        }

        PasswordResetToken passwordResetToken = tokenOptional.get();
        User user = passwordResetToken.getUser(); // 토큰에 연결된 사용자 가져오기

        // 2. 새로운 비밀번호 암호화 및 사용자 비밀번호 업데이트
        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encodedNewPassword); 

        // 3. 사용된 토큰을 무효화합니다.
        passwordResetToken.setUsed(true);
        passwordResetTokenRepository.save(passwordResetToken); // 무효화 상태 저장

        log.info("2-step password reset successful for user: {}", user.getUsername());

        return true; // 비밀번호 변경 성공
    }


    
}
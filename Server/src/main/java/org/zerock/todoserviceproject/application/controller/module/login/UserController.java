package org.zerock.todoserviceproject.application.controller.module.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Optional;

import org.zerock.todoserviceproject.application.dto.login.SignUpRequest;
import org.zerock.todoserviceproject.application.dto.login.UsernameCheckRequest;
import org.zerock.todoserviceproject.application.dto.login.LoginRequest;

import org.zerock.todoserviceproject.application.dto.login.PasswordVerificationRequest;
import org.zerock.todoserviceproject.application.dto.login.PasswordVerificationResponse;
import org.zerock.todoserviceproject.application.dto.login.PasswordResetRequest;
import org.zerock.todoserviceproject.application.dto.login.LoginSuccessResponse;

import org.zerock.todoserviceproject.domain.service.module.login.UserService;

@RestController // REST 컨트롤러
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 아이디 중복 확인 API 엔드포인트
     * Put /auth/check-username?username
     * @param request 확인할 아이디 (@RequestBody로 받음)
     * @return 아이디 사용 가능 시 200 OK ("success"), 중복 시 409 Conflict ("fault")
     */
    @PutMapping("/check-username")
    public ResponseEntity<String> checkUsername(@RequestBody UsernameCheckRequest request) {

        String username = request.getUsername();
        if (userService.isUsernameAvailable(username)) {
            // 아이디 사용 가능
            return new ResponseEntity<>("success", HttpStatus.OK); // 200 OK
        } else {
            // 아이디 중복
            return new ResponseEntity<>("fault", HttpStatus.CONFLICT); // 409 Conflict
        }
    }

    /**
     * 회원가입 API 엔드포인트
     * POST /auth/register
     * 요청 본문 (JSON) : SignUpRequest DTO 형식
     * @param signUpRequest 회원가입 요청 DTO (@RequestBody로 받음)
     * @return 회원가입 성공 시 201 Created ("success"), 아이디 중복 시 409 Conflict ("fault"),
     * 유효성 검사 실패 시 400 Bad Request (Spring이 자동 처리)
     */
    @PostMapping("/register")

    public ResponseEntity<String> registerUser(@Validated @RequestBody SignUpRequest signUpRequest) {

        boolean isRegistered = userService.registerUser(signUpRequest);

        if (isRegistered) {
            // 회원가입 성공
            return new ResponseEntity<>("success", HttpStatus.CREATED); // 201 Created
        } else {
            // 아이디 중복으로 인한 회원가입 실패
            return new ResponseEntity<>("fault", HttpStatus.CONFLICT); // 409 Conflict
        }
    }


    /**
     * 로그인 API 엔드포인트
     * POST /auth/login
     * 요청 본문 (JSON): LoginRequest DTO 형식
     * @param loginRequest 로그인 요청 DTO (@RequestBody로 받음)
     * @return 로그인 성공 시 "Login successful" 및 유저정보 (200 OK), 실패 시 오류 메시지 (401 Unauthorized 등)
     */
    @PostMapping("/login")
    @Validated

    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {


        boolean isAuthenticated = userService.verifyCredentials(loginRequest.getUsername(), loginRequest.getPassword());

        if (isAuthenticated) {
           //로그인 성공
           LoginSuccessResponse response = new LoginSuccessResponse("Login successful", loginRequest.getUsername());
           return ResponseEntity.ok().body(response);
        } else {
            //로그인 실패
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
    /**
     * 1단계: 비밀번호 변경을 위한 사용자 본인 확인 및 임시 토큰 발급 API
     * POST /auth/verify-user-for-password-change
     * 요청 본문 (JSON): PasswordVerificationRequest DTO 형식
     * @param request 본인 확인 요청 정보 (아이디, 이름, 전화번호)
     * @return 본인 확인 성공 시 토큰을 담은 PasswordVerificationResponse (200 OK),
     * 불일치 시 오류 응답 (404 Not Found)
     */
    @PostMapping("/verify-user-for-password-change")
    @Validated // PasswordVerificationRequest DTO 유효성 검사
    public ResponseEntity<?> verifyUserForPasswordChange(@RequestBody PasswordVerificationRequest request) {
        // 서비스 메서드는 성공 시 Optional<PasswordVerificationResponse> 반환
        Optional<PasswordVerificationResponse> responseOptional = userService.verifyUserForPasswordChange(request);

        if (responseOptional.isPresent()) {
            // 본인 확인 성공, 토큰 포함된 응답 DTO 반환
            return new ResponseEntity<>(responseOptional.get(), HttpStatus.OK); // 200 OK
        } else {
            // 사용자 정보 불일치 또는 찾을 수 없음

            return new ResponseEntity<>("user not found", HttpStatus.NOT_FOUND); // 404 Not Found
        }
    }



    /**
     * 2단계: 임시 토큰과 새로운 비밀번호를 받아 비밀번호 변경 API
     * POST /auth/reset-password
     * 요청 본문 (JSON): PasswordResetRequest DTO 형식
     * @param request 비밀번호 변경 요청 정보 (토큰, 새로운 비밀번호)
     * @return 비밀번호 변경 성공 시 "password changed" (200 OK), 실패 시 "failed" (400 Bad Request 등)
     */
    @PostMapping("/reset-password")
    @Validated
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest request) {
        // 서비스 메서드는 토큰 검증 및 비밀번호 변경 후 성공 여부 반환
        boolean isReset = userService.resetPassword(request);

        if (isReset) {
            return new ResponseEntity<>("password changed", HttpStatus.OK); // 200 OK
        } else {
            // 토큰 유효하지 않음, 만료, 사용됨 또는 사용자 미발견 등 서비스 로직 내 실패
            return new ResponseEntity<>("failed", HttpStatus.BAD_REQUEST); // 400 Bad Request
        }
    }


}
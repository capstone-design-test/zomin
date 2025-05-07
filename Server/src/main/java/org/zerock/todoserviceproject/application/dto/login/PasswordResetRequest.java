package org.zerock.todoserviceproject.application.dto.login;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetRequest {

    @NotBlank(message = "인증 토큰이 필요합니다.") // 1단계에서 받은 토큰 필드 추가
    private String token;

    @NotBlank(message = "새 비밀번호는 필수 입력 값입니다.")
    private String newPassword;
}
package org.zerock.todoserviceproject.application.dto.login;

import jakarta.validation.constraints.NotBlank; 
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpRequest {

    @NotBlank(message = "아이디는 필수 입력 값입니다.") // 비어있거나 공백만 있는 경우 에러
    private String username;

    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    
    private String password;

    @NotBlank(message = "이름은 필수 입력 값입니다.")
   
    private String name;

    @NotBlank(message = "전화번호는 필수 입력 값입니다.")
    
    private String phoneNumber;
}

//dto의 오류메시지들은 터미널에서만 확인가능 따로 오류처리용 GlobalExceptionHandler 만들어서 메시지 가지고와서 처리해야 username empty같은 오류메시지 반환가능
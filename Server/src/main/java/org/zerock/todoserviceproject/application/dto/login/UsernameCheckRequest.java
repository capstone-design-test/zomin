package org.zerock.todoserviceproject.application.dto.login;

import jakarta.validation.constraints.NotBlank; 
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class UsernameCheckRequest {

    @NotBlank(message = "확인할 아이디는 필수 입력 값입니다.") 
    private String username;

    
}
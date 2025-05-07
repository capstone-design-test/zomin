package org.zerock.todoserviceproject.application.dto.login;

import lombok.AllArgsConstructor; 
import lombok.Getter; 
import lombok.NoArgsConstructor; 
import lombok.Setter; 

@Getter
@Setter
@NoArgsConstructor 
@AllArgsConstructor 
public class LoginSuccessResponse {
    private String message; 
    private String username; 
}
package com.yo.day1.repository;

import com.yo.day1.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    java.util.Optional<User> findByUsername(String username);

}

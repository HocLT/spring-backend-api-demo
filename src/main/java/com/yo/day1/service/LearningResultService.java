package com.yo.day1.service;

import com.yo.day1.common.exception.BadRequestException;
import com.yo.day1.common.exception.ConflictException;
import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.dto.learningresult.LearningResultCreateRequest;
import com.yo.day1.dto.learningresult.LearningResultResponse;

import java.util.List;

public interface LearningResultService {

    LearningResultResponse create(LearningResultCreateRequest request, String username) throws ConflictException, NotFoundException, BadRequestException;

    List<LearningResultResponse> findByStudentId(Long studentId, String username) throws BadRequestException, NotFoundException;

}

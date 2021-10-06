package com.gearsofleo.platform.flamingo.infrastructure

import io.restassured.RestAssured
import io.restassured.builder.RequestSpecBuilder
import io.restassured.specification.RequestSpecification
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs
import org.springframework.core.env.Environment
import org.springframework.core.env.get
import org.springframework.restdocs.RestDocumentationContextProvider
import org.springframework.restdocs.RestDocumentationExtension
import org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessRequest
import org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse
import org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint
import org.springframework.restdocs.restassured3.RestAssuredRestDocumentation
import org.springframework.restdocs.restassured3.RestAssuredRestDocumentation.document
import org.springframework.test.context.junit.jupiter.SpringExtension

/*

Usage:

    class MyRestApiDocsTest(@LocalServerPort port: Int, @Autowired environment: Environment) :
        RestApiDocsTest(environment, port) {

        fun test() {
            Given {
                spec(of("operation-name"))
                // defined jsonBody and WireMock setup
            }.

            When {
                // specify request options: method and path
            }.

            Then {
                // assert actual response: status and body
            }
        }
    }

*/

@AutoConfigureRestDocs
@DisplayName("REST API documentation test")
@ExtendWith(RestDocumentationExtension::class, SpringExtension::class)
abstract class RestApiDocsTest(environment: Environment, port: Int) : WireMockTest() {

    private val applicationName = environment["spring.application.name"]
    private val baseUrl = { "http://127.0.0.1:$port/$applicationName" }
    protected val url: (String) -> String = { baseUrl() + it }
    private lateinit var spec: RequestSpecification

    @BeforeEach
    protected fun setUp(restDocumentation: RestDocumentationContextProvider) {
        spec = RequestSpecBuilder()
            .addFilter(RestAssuredRestDocumentation.documentationConfiguration(restDocumentation))
            .build()
    }

    protected fun of(snippetIdentifier: String): RequestSpecification = prettyPrint().run {
        RestAssured.given(spec).filter(
            document(snippetIdentifier, preprocessRequest(this), preprocessResponse(this))
        )
    }
}

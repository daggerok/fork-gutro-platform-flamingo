package com.gearsofleo.platform.flamingo.config

import com.gearsofleo.rhino.core.exception.base.SystemException
import feign.Response
import feign.codec.ErrorDecoder
import org.springframework.beans.factory.ObjectFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.http.HttpMessageConverters
import org.springframework.cloud.openfeign.support.ResponseEntityDecoder
import org.springframework.cloud.openfeign.support.SpringDecoder
import org.springframework.cloud.openfeign.support.SpringEncoder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.converter.protobuf.ProtobufHttpMessageConverter
import java.io.ObjectInputStream


@Configuration
class FeignConfiguration {
    @Autowired
    private val messageConverters: ObjectFactory<HttpMessageConverters>? = null

    @Bean
    internal fun protobufHttpMessageConverter() = ProtobufHttpMessageConverter()

    @Bean
    fun springEncoder() = SpringEncoder(this.messageConverters)

    @Bean
    fun springDecoder() = ResponseEntityDecoder(SpringDecoder(this.messageConverters))

    @Bean
    fun errorDecoder() = CustomErrorDecoder()

}

class CustomErrorDecoder : ErrorDecoder {

    override fun decode(methodKey: String?, response: Response?): Exception {
        if (response != null && response.headers()["content-type"] != null && response.headers()["content-type"]!!.any { it == "application/x-java-serialized-object" }) {
            return response.body().asInputStream().use {
                ObjectInputStream(it).readObject() as SystemException
            }
        }
        return Exception()
    }
}

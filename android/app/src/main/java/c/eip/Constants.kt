package c.eip

import c.eip.services.AuthAPI
import c.eip.services.OfferService
import c.eip.services.ProfilService
import c.eip.services.UtilsService
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object Constants {
    private const val BASE_URL = "http://168.63.65.106:80/"
    private var retrofit: Retrofit =
        Retrofit.Builder().baseUrl(BASE_URL).addConverterFactory(GsonConverterFactory.create())
            .build()

    var profilService: ProfilService = retrofit.create(ProfilService::class.java)
    val authService: AuthAPI.AuthService = retrofit.create(AuthAPI.AuthService::class.java)
    val utilsService: UtilsService = retrofit.create(UtilsService::class.java)
    val offerService: OfferService = retrofit.create(OfferService::class.java)

    private val gson: Gson = GsonBuilder()
        .setLenient()
        .create()
    var retrofitTest: Retrofit =
        Retrofit.Builder().baseUrl(BASE_URL).addConverterFactory(GsonConverterFactory.create(gson))
            .build()
    var profilServiceTest: ProfilService = retrofitTest.create(ProfilService::class.java)
    val authServiceTest: AuthAPI.AuthService = retrofitTest.create(AuthAPI.AuthService::class.java)
    val utilsServiceTest: UtilsService = retrofitTest.create(UtilsService::class.java)
    val offerServiceTest: OfferService = retrofitTest.create(OfferService::class.java)
}

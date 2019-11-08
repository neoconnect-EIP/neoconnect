package c.eip.model

import com.google.gson.annotations.SerializedName

class Influenceur {
    @SerializedName("idUser")
    var idUser: Int? = 0
    @SerializedName("pseudo")
    var pseudo: String? = ""
    @SerializedName("password")
    var password: String? = ""
    @SerializedName("email")
    var email: String? = ""
    @SerializedName("full_name")
    var full_name: String? = ""
    @SerializedName("phone")
    var phone: String? = ""
    @SerializedName("city")
    var city: String? = ""
    @SerializedName("postal")
    var postal: String? = ""
    @SerializedName("theme")
    var sujet: String? = ""
    @SerializedName("facebook")
    var facebook: String? = ""
    @SerializedName("twitter")
    var twitter: String? = ""
    @SerializedName("snapchat")
    var snapchat: String? = ""
    @SerializedName("instagram")
    var instagram: String = ""
    @SerializedName("token")
    var token: String? = ""
}
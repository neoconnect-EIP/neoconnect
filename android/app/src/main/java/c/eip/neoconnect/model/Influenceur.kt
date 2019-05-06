package c.eip.neoconnect.model

import com.google.gson.annotations.SerializedName

class Influenceur(
    @SerializedName("pseudo")
    var pseudo: String? = "",
    @SerializedName("password")
    var password: String? = "",
    @SerializedName("email")
    var email: String? = "",
    @SerializedName("full_name")
    var name: String? = "",
    @SerializedName("phone")
    var phone: String? = "",
    @SerializedName("city")
    var city: String? = "",
    @SerializedName("postal")
    var postal: String? = "",
    @SerializedName("sujet")
    var sujet: String? = "",
    @SerializedName("facebook")
    var facebook: String? = "",
    @SerializedName("twitter")
    var twitter: String? = "",
    @SerializedName("snapchat")
    var snapchat: String? = "",
    @SerializedName("instagram")
    var instagram: String = ""
)
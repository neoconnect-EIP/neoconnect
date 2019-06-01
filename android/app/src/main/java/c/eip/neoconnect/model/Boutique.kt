package c.eip.neoconnect.model

import com.google.gson.annotations.SerializedName

class Boutique(
    @SerializedName("pseudo")
    var pseudo: String? = "",
    @SerializedName("password")
    var password: String? = "",
    @SerializedName("email")
    var email: String? = "",
    @SerializedName("full_name")
    var full_name: String? = "",
    @SerializedName("phone")
    var phone: String? = "",
    @SerializedName("city")
    var city: String? = "",
    @SerializedName("postal")
    var postal: String? = "",
    @SerializedName("sujet")
    var sujet: String? = "",
    @SerializedName("society")
    var society: String? = "",
    @SerializedName("fonction")
    var fonction: String? = ""
)
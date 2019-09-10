package c.eip.model

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class UserModel : ViewModel() {
    val inf = MutableLiveData<Influenceur>()
    val shop = MutableLiveData<Boutique>()

    fun setShop(data: Boutique?) {
        shop.value = data
    }

    fun setInf(data: Influenceur?) {
        inf.value = data
    }
}
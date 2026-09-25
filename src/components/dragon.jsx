import React, {
    useEffect,
    useRef,
    useMemo,
    useState,
    } from 'react'

import * as THREE from 'three'

import { useThree, useFrame } from '@react-three/fiber'

import {
    useGLTF,
    useTexture,
    useAnimations,
    ContactShadows,
    Sparkles,
} from '@react-three/drei'

import {
    EffectComposer,
    Bloom,
    ChromaticAberration,
    Noise,
    Vignette,
    } from '@react-three/postprocessing'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP)
gsap.registerPlugin(ScrollTrigger)

const MODEL_PATH = '/models/model.glb'
const NORMAL_MAP_PATH = '/MI_M_B_44_Qishilong_body02_2_Inst_normal.png'

const MATCAP_PATHS = [
    '/matcap/mat-1.png', '/matcap/mat-2.png', '/matcap/mat-3.png', '/matcap/mat-4.png',
    '/matcap/mat-5.png', '/matcap/mat-6.png', '/matcap/mat-7.png', '/matcap/mat-8.png',